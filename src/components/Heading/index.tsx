import { FC } from 'preact/compat'

type Props = {
  children: React.ReactNode
  className?: string
}

export const Heading: FC<Props> = ({ children, className }) => {
  return <h1 className={`text-4xl text-center ${className}`}>{children}</h1>
}
