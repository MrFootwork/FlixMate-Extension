import { generateNonReactProject } from './vite.config.js'

async function main() {
  const connectConfig = await generateNonReactProject()
  // Use the reactConfig to create a Vite build
  // For example, you can use vite.rollupPluginOptions(reactConfig) to configure your build
  console.log('Building flixmateConnect...')
  // Add additional logic here if needed
}

main().catch(err => {
  console.error(err)
})
