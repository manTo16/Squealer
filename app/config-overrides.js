const { alias } = require('react-app-rewire-alias')

module.exports = function override(config, env) {
  alias({
    '@components': 'src/components',
    '@utils': 'src/utils',
    '@hooks': 'src/hooks',
    '@root': ''
    // Aggiungi qui altri alias se necessario
  })(config)

  return config
}