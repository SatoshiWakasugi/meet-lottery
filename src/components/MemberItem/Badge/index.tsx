import { FC } from 'preact/compat'

type Props = {
  children: React.ReactNode
  className?: string
}

export const Badge: FC<Props> = ({ children = 'true', className }) => {
  return (
    <div className={`bg-green-400 w-2.5 h-2.5 rounded-full ${className}`}>
      <div className="hidden">{children}</div>
    </div>
  )
}
