'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ArtikelenForm from '@/components/admin/ArtikelenForm'
import type { Article } from '@/types'

interface Props {
  initialArticles: Article[]
}

export default function ArtikelenPageClient({ initialArticles }: Props) {
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const supabase = createClient()

  async function refresh() {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .order('category')
      .order('name')
    setArticles(data ?? [])
  }

  return <ArtikelenForm articles={articles} onRefresh={refresh} />
}
