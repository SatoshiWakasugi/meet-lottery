import { FC } from 'preact/compat'

type Props = {
  children: React.ReactNode
  className?: string
}

export const Description: FC<Props> = ({ children, className }) => {
  return <p className={`py-2 text-xs text-center ${className}`}>{children}</p>
}
