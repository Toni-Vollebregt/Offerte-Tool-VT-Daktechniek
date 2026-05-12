'use client'

import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer'
import OfferteDocument from '@/lib/pdf/template'
import type { EstimateLine, CompanySettings, Customer } from '@/types'
import Button from '@/components/ui/Button'

interface Props {
  estimateNumber: string
  customer: Customer
  description: string
  lines: EstimateLine[]
  settings: CompanySettings
}

export default function PdfPreview({ estimateNumber, customer, description, lines, settings }: Props) {
  const logoUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/logo.png`
    : undefined

  const docProps = {
    estimateNumber,
    createdAt: new Date(),
    customer,
    description,
    lines,
    settings,
    logoUrl,
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <PDFDownloadLink
          document={<OfferteDocument {...docProps} />}
          fileName={`${estimateNumber}.pdf`}
        >
          {({ loading }) => (
            <Button loading={loading}>
              {loading ? 'PDF genereren…' : 'Download PDF'}
            </Button>
          )}
        </PDFDownloadLink>
      </div>
      <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm" style={{ height: 750 }}>
        <PDFViewer width="100%" height="100%" showToolbar={false}>
          <OfferteDocument {...docProps} />
        </PDFViewer>
      </div>
    </div>
  )
}
