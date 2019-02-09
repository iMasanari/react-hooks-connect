/** @jsx React.createElement */

// @ts-check
/// <reference path="./types.d.ts" />

const connect = reactHooksConnect.default

/** 
 * @typedef CounterState 
 * @property {number} count
 * @property {() => void} increment
 * @property {number} resetCount
 * @property {() => void} reset
 */

/** @type {React.Context<CounterState>} */
const CounterContext = React.createContext(/** @type {any} */(null))

const mapProviderValueHooks = () => {
  const [count, setCount] = React.useState(0)
  const [resetCount, setResetCount] = React.useState(0)

  const increment = React.useCallback(() => {
    setCount((current) => current + 1)
  }, [])

  const reset = React.useCallback(() => {
    setCount(0)
    setResetCount((current) => current + 1)
  }, [])

  return { count, increment, resetCount, reset }
}


const Provider = connect(mapProviderValueHooks)(
  ({ children, ...value }) =>
    <CounterContext.Provider value={value}>
      {children}
    </CounterContext.Provider>
)

/** @param {{count: number, onClick: () => void, label: string}} props */
const Counter = (props) =>
  <div>
    <span className="count" key={Math.random()}>
      {props.count}
    </span>
    <button onClick={props.onClick}>{props.label}</button>
  </div>


/** @param {{ label: string }} props*/
const mapCounterHooks = (props) => {
  const { count, increment } = React.useContext(CounterContext)

  return { count, onClick: increment }
}

const CountCounter = connect(mapCounterHooks)(Counter)

const mapResetHooks = () => {
  const { resetCount, reset } = React.useContext(CounterContext)

  return { count: resetCount, onClick: reset, label: 'reset' }
}

const ResetCounter = connect(mapResetHooks)(Counter)


ReactDOM.render(
  <Provider>
    <div>
      <CountCounter label="+" />
      <ResetCounter />
    </div>
  </Provider>,
  document.getElementById('app')
)
