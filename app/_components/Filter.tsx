'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const Filter = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const activeFilter = searchParams.get('capacity') ?? 'all'

  const handleFilter = (filter: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('capacity', filter)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className='border border-primary-800 flex'>
      <Button
        filter='all'
        activeFilter={activeFilter}
        handleFilter={handleFilter}
      >
        All cabins
      </Button>

      <Button
        filter='small'
        activeFilter={activeFilter}
        handleFilter={handleFilter}
      >
        1 - 3 guests
      </Button>

      <Button
        filter='medium'
        activeFilter={activeFilter}
        handleFilter={handleFilter}
      >
        4 - 7 guests
      </Button>

      <Button
        filter='large'
        activeFilter={activeFilter}
        handleFilter={handleFilter}
      >
        8 - 12 guests
      </Button>
    </div>
  )
}

const Button = ({
  filter,
  handleFilter,
  activeFilter,
  children,
}: {
  filter: string
  handleFilter: (filter: string) => void
  activeFilter: string
  children: React.ReactNode
}) => (
  <button
    className={`px-5 -y-2 hover:bg-primary-700 ${
      filter === activeFilter ? 'bg-primary-700 text-primary-50' : ''
    }`}
    onClick={() => handleFilter(filter)}
  >
    {children}
  </button>
)

export default Filter
