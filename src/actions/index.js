/**
 * Clears the client's console history
 */
const clearHistory = () => ({ type: 'CLEAR_HISTORY' })

/**
 * echos text to the client
 * @param {string} value text to echo to client
 * @param {object} [options] optional values
 */
const echo = (value, options) => ({ type: 'ECHO', value, ...options })

/**
 * Sends the exit command to the terminal
 */
const exit = () => ({ type: 'EXIT' })

/**
 * Prompts the client for input
 * @param {object} options Prompt options. TODO: Populate this.
 */
const prompt = value => ({ type: 'PROMPT', value })

/**
 * Sets the clients prompt
 * @param {string} prompt The prompt
 */
const setPrompt = value => ({ type: 'SET_PROMPT', value })

/**
 * Sends a state to the client
 * @param {object} value State to pass to the client
 */
const setState = value => ({ type: 'SET_STATE', value })

/**
 * Pushes a new history onto the history stack
 * @param {Array} value History to push onto the History Stack
 */
const historyStackPush = value => ({ type: 'HISTORY_STACK_PUSH', value })

/**
 * Pops the history stack
 */
const historyStackPop = () => ({ type: 'HISTORY_STACK_POP' })

module.exports = {
  clearHistory,
  echo,
  exit,
  prompt,
  setState,
  setPrompt,
  historyStackPush,
  historyStackPop
}
