import { FC } from 'preact/compat'

type Props = {
  children: React.ReactNode
  className?: string
}

export const Message: FC<Props> = ({ children, className }) => {
  return <p className={`text-rose-600 text-xs ${className}`}>{children}</p>
}
