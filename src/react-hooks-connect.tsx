import React from 'react'

interface ConnectedComponent<OwnProps, Props> extends React.FunctionComponent<OwnProps> {
  WrappedComponent: React.ComponentType<Props>
}

const defaultMergeProps = (hooksProps: any, ownProps: any) => ({ ...ownProps, ...hooksProps })

export default <OwnProps, HooksProps, Props = HooksProps>(
  mapHooks: (ownProps: OwnProps) => HooksProps,
  mergeProps = defaultMergeProps as (hooksProps: HooksProps, ownProps: OwnProps) => Props,
) =>
  (Component: React.ComponentType<Props>): ConnectedComponent<OwnProps, Props> => {
    type MemolizedProps = HooksProps & { $$ownProps: OwnProps }
    const Memolized = React.memo(({ $$ownProps, ...hooksProps }: MemolizedProps) => {
      const props = mergeProps(hooksProps as any as HooksProps, $$ownProps)
      return <Component {...props} />
    })

    const Connected = (
      (ownProps) => {
        const hooksProps = mapHooks(ownProps) as React.PropsWithRef<MemolizedProps>
        return <Memolized $$ownProps={ownProps} {...hooksProps} />
      }
    ) as ConnectedComponent<OwnProps, Props>

    Connected.WrappedComponent = Component

    return Connected
  }
