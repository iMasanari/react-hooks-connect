import React from 'react'

interface ConnectedComponent<OwnProps, MergeProps> extends React.FunctionComponent<OwnProps> {
  WrappedComponent: React.ComponentType<MergeProps>
}

type PrivateData<OwnProps, HooksProps, MergeProps> = [
  React.ComponentType<MergeProps>,
  OwnProps,
  (hooksProps: HooksProps, ownProps: OwnProps) => MergeProps
]

interface MemolizedProps<OwnProps, HooksProps, MergeProps> {
  REACT_HOOKS_CONNECT_PRIVATE_PROP: PrivateData<OwnProps, HooksProps, MergeProps>
}

const Memolized = React.memo((
  { REACT_HOOKS_CONNECT_PRIVATE_PROP: [Component, ownProps, mergeProps], ...hooksProps }: MemolizedProps<any, any, any>
) => {
  const props = mergeProps(hooksProps, ownProps)

  return <Component {...props} />
})

const defaultMergeProps = (hooksProps: any, ownProps: any) => ({ ...ownProps, ...hooksProps })

const connect = <OwnProps extends {} = {}, HooksProps = {}, MergeProps = OwnProps & HooksProps>(
  mapHooks: (ownProps: OwnProps) => HooksProps,
  mergeProps = defaultMergeProps as (hooksProps: HooksProps, ownProps: OwnProps) => MergeProps,
) =>
  (Component: React.ComponentType<MergeProps>): ConnectedComponent<OwnProps, MergeProps> => {
    const Connected = (
      (ownProps) => {
        const _data: PrivateData<OwnProps, HooksProps, MergeProps> = [Component, ownProps, mergeProps]
        const privateData = React.useMemo(() => _data, _data)
        const hooksProps = mapHooks(ownProps) as React.PropsWithRef<HooksProps>

        return (
          <Memolized
            REACT_HOOKS_CONNECT_PRIVATE_PROP={privateData}
            {...hooksProps}
          />
        )
      }
    ) as ConnectedComponent<OwnProps, MergeProps>

    Connected.WrappedComponent = Component

    return Connected
  }

export default connect
