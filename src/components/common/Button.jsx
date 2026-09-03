export default function Button({ children, className = '', variant = 'primary', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition'
  const styles = {
    primary: 'bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200',
    secondary: 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white',
  }
  return <button className={`${base} ${styles[variant]} ${className}`} {...props}>{children}</button>
}
