import React from 'react'

interface ConnectedComponent<OwnProps, Props> extends React.FunctionComponent<OwnProps> {
  WrappedComponent: React.ComponentType<Props>
}

type PrivateData<OwnProps, HooksProps, Props> = [
  React.ComponentType<Props>,
  OwnProps,
  (hooksProps: HooksProps, ownProps: OwnProps) => Props
]

interface MemolizedProps<OwnProps, HooksProps, Props> {
  REACT_HOOKS_CONNECT_PRIVATE_PROP: PrivateData<OwnProps, HooksProps, Props>
}

const Memolized = React.memo((
  { REACT_HOOKS_CONNECT_PRIVATE_PROP: [Component, ownProps, mergeProps], ...hooksProps }: MemolizedProps<any, any, any>
) => {
  const props = mergeProps(hooksProps, ownProps)

  return <Component {...props} />
})

const defaultMergeProps = (hooksProps: any, ownProps: any) => ({ ...ownProps, ...hooksProps })

const connect = <OwnProps, HooksProps, Props = HooksProps>(
  mapHooks: (ownProps: OwnProps) => HooksProps,
  mergeProps = defaultMergeProps as (hooksProps: HooksProps, ownProps: OwnProps) => Props,
) =>
  (Component: React.ComponentType<Props>): ConnectedComponent<OwnProps, Props> => {
    const Connected = (
      (ownProps) => {
        const _data: PrivateData<OwnProps, HooksProps, Props> = [Component, ownProps, mergeProps]
        const privateData = React.useMemo(() => _data, _data)
        const hooksProps = mapHooks(ownProps) as React.PropsWithRef<HooksProps>

        return (
          <Memolized
            REACT_HOOKS_CONNECT_PRIVATE_PROP={privateData}
            {...hooksProps}
          />
        )
      }
    ) as ConnectedComponent<OwnProps, Props>

    Connected.WrappedComponent = Component

    return Connected
  }

export default connect
