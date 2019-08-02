/* eslint-disable */
process.env.NODE_ENV = 'production';
const npm = `node ${process.env.npm_execpath}`;
console.log('cmd npm:', npm);

const st = new Date().getTime();

const fs = require('fs-promise');
const path = require('path');
const colors = require('colors/safe');

colors.enabled = true;
const cpp_exec = require('child_process').exec;

const exec = function(cmd) {
	return new Promise(((resolve, reject) => {
		const c = cpp_exec(cmd, (error, stdout, stderr) => {
			if (error !== null) {
				console.error(`exec error: ${error}`);
				reject(error);
			} else {
				resolve();
			}
		});
		c.stdout.pipe(process.stdout);
		c.stderr.pipe(process.stdout);
	}));
};


const cp = function(src, tar) {
	return fs.exists(src).then(exists => (exists ? fs.copy(src, tar) : Promise.resolve(false)));
};

function pack(src, dist) {
	const tar = require('tar-pack');
	return new Promise((resolve, reject) => {
		tar.pack(src, {
				fromBase: true
			})
			.pipe(require('fs').createWriteStream(dist))
			.on('error', (err) => {
				reject(err);
			})
			.on('close', () => {
				resolve();
			});
	});
}

const basePath = `${path.resolve(__dirname, '..')}/`;
const pkgconf = require(`${basePath}package.json`);


const error = colors.red;
const argv = Array.prototype.concat.apply([], process.argv);
const outputPath = `${basePath}output/`;
const pkgPath = `${basePath}pkg/`;
const releaseType = argv[2] || 'update';

const modules = [];
for (var module in pkgconf.dependencies) {
	modules.push(module);
}

if (releaseType == 'all') {
	for (var module in pkgconf.devDependencies) {
		modules.push(module);
	}
}


Promise.resolve()
	.then(() =>
		/* package.json */
		// 避免同步删除
		fs.exists(outputPath).then(exists => exists && fs.remove(outputPath)).then(() => fs.mkdir(outputPath)).then(() => Promise.all([
			fs.copy(`${basePath}package.json`, `${outputPath}package.json`),
			cp(`${basePath}npm-shrinkwrap.json`, `${outputPath}npm-shrinkwrap.json`).then(() => cp(`${basePath}npm-shrinkwrap.production.json`, `${outputPath}npm-shrinkwrap.json`)),
			cp(`${basePath}yarn.lock`, `${outputPath}yarn.lock`),
		])),
	)
	.then(() => {
		/* node_modules */
		if (releaseType != 'local' && releaseType != 'update') {
			console.log('begin release with node_modules');

			return Promise.resolve().then(() => {
				// 依赖
				if (releaseType == 'online' || releaseType == 'i') {
					console.log('\t npm install!');

					let cmd = `cd ${outputPath} && ${npm} install -d`;
					if (true || releaseType == 'online') {
						cmd += ' --production';
					}

					return exec(cmd);
				} else if (releaseType == 'all' || releaseType == 'c') {
					console.log('\t copy!');

					const modulesPath = `${basePath}node_modules`;
					return fs.exists(modulesPath).then((exists) => {
						if (exists) {
							if (releaseType == 'all') {
								return fs.copy(modulesPath, `${outputPath}/node_modules`);
							}

							const modulesCpP = modules.map((module) => {
								const mp = `${basePath}node_modules/${module}`;
								return fs.exists(mp).then(exists => exists && fs.mkdirs(outputPath + mp).then(() => {
									fs.copy(mp, outputPath + mp);
								}));
							});
							return Promise.all(modulesCpP);
						}
						console.log(colors.yellow('maybe you want copy node_modules, but node_modules is not exist.'));
					});
				}
			});
		}
		fs.symlinkSync(`${basePath}node_modules`, `${outputPath}node_modules`, 'dir');
	})
	.then(() => {
		console.log('begin run cp lib');
		return exec('npm run cp-lib release');
	})
	.then(() => {
		console.log('begin run webpack release');
		// 清理编译目录
		fs.removeSync(`${basePath}www/static/build/`);
		// 使用系统调用，防止io延迟
		return exec('npm run webpack.production');
	})
	.then(() => {
		/* 调用fis进行编译 */
		console.log('begin run fis3 release');

		// io问题，调用子进程解决
		return exec(`npm run fis -- ${releaseType}`);
	})
	.then(() => {
		const op = path.resolve(outputPath);

		if (!fs.existsSync(pkgPath)) {
			fs.mkdirSync(pkgPath);
		}

		/* npm打包 */
		if (releaseType == 'update') {
			console.log('begin tar');
			return fs.remove(`${outputPath}node_modules`).then(() => pack(`${basePath}output/`, `${pkgPath + pkgconf.name}-${pkgconf.version}.update.tgz`));
		} else if (releaseType != 'local') {
			console.log('begin tar|pack with node_modules');

			return Promise.resolve().then(() => {
				const outpkgconf = Object.assign({}, pkgconf, {
					bundleDependencies: modules
				});
				delete outpkgconf.scripts.prepublish;
				fs.outputJSONSync(`${outputPath}package.json`, outpkgconf);

				// 打包
				if (releaseType == 'online' || releaseType == 'c') {
					console.log('\t tar!');
					return pack(`${basePath}output/`, `${pkgPath + pkgconf.name}-${pkgconf.version}.copy.tgz`);
				}
				console.log('\t pack!');

				return exec(`cd ${pkgPath} && npm pack ${op}`);
			});
		}
	})
	.then(() => {
		console.log('\nrelease success!');
		console.log(colors.green(`time: ${new Date().getTime() - st}ms`));

		if (releaseType != 'local') {
			if (releaseType != 'update') {
				var shrinkwrap = Promise.all([fs.exists(`${basePath}npm-shrinkwrap.production.json`), fs.exists(`${basePath}yarn.lock`)]).then((exists, yarn) => !exists && !yarn && exec(`cd ${outputPath} && npm prune && npm shrinkwrap`).then(() => {
					cp(`${outputPath}npm-shrinkwrap.json`, `${basePath}npm-shrinkwrap.production.json`);
				}));
			} else {
				var shrinkwrap = Promise.resolve();
			}

			if (!process.env.KEEP_OUTPUT) {
				const del = shrinkwrap.then(() => fs.exists(outputPath).then(exists => exists && fs.remove(outputPath)));
			}
		}
	})
	.catch((err) => {
		console.error(error(`[error] release fail. maybe need sudo!\n${err.message}`));
	});
