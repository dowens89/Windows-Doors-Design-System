import { useEffect } from 'react'

interface SchemaTagProps {
  schema: object
}

export function SchemaTag({ schema }: SchemaTagProps) {
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [schema])

  return null
}
