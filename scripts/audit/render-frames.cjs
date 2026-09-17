// Render the actual registered animations at every integer second.
const {bundle} = require('@remotion/bundler');
const {getCompositions, renderFrames} = require('@remotion/renderer');
const fs = require('node:fs');
const path = require('node:path');
(async () => {
  const root = path.resolve(process.argv[2] || '.audit/before');
  const serveUrl = await bundle({entryPoint: path.resolve('remotion/index.ts')});
  const browserExecutable = '/usr/bin/google-chrome';
  const compositions = (await getCompositions(serveUrl, {browserExecutable})).filter(c=>c.id !== 'placeholder' && !fs.existsSync(`public/videos/${c.id}.mp4`));
  fs.mkdirSync(root, {recursive:true});
  fs.writeFileSync(path.join(root, 'compositions.json'), JSON.stringify(compositions, null, 2));
  for (const composition of compositions) {
    const outputDir = path.join(root, composition.id);
    fs.mkdirSync(outputDir, {recursive:true});
    await renderFrames({serveUrl, composition, browserExecutable, inputProps:composition.props, outputDir,
      imageFormat:'jpeg', jpegQuality:85, everyNthFrame:composition.fps, scale:0.5, concurrency:4,
      onStart:()=>{}, onFrameUpdate:()=>{}});
    console.log(`${composition.id}: ${composition.durationInFrames/composition.fps}s sampled`);
  }
})().catch(e=>{console.error(e);process.exit(1)});
