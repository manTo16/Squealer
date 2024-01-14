const { alias } = require('react-app-rewire-alias')

module.exports = function override(config, env) {
  alias({
    '@components': 'src/components',
    '@hooks': 'src/hooks',
    '@root': ''
    // Aggiungi qui altri alias se necessario
  })(config)

  return config
}