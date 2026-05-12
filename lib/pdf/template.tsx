'use client'

import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import type { EstimateLine, CompanySettings } from '@/types'
import { formatEuro, regelPrijs, berekenTotalen, addDays, formatDate } from '@/lib/utils'

const RED = '#cc0000'
const DARK = '#2d2d2d'
const GRAY = '#666666'
const LIGHT = '#f7f7f7'

const FOOTER_HEIGHT = 30

const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    color: DARK,
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
  },

  accentBar: {
    backgroundColor: RED,
    height: 6,
    flexShrink: 0,
  },

  // body neemt de resterende ruimte op (tussen accentBar en footerWrap)
  body: {
    flex: 1,
    paddingHorizontal: 44,
    paddingTop: 28,
    paddingBottom: FOOTER_HEIGHT + 8,
    display: 'flex',
    flexDirection: 'column',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    flexShrink: 0,
  },
  offerteTitle: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: RED,
    letterSpacing: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  logo: {
    width: 110,
    height: 44,
    objectFit: 'contain',
    marginBottom: 6,
  },
  companyName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: DARK,
    textAlign: 'right',
  },
  companyLine: {
    fontSize: 8.5,
    color: GRAY,
    textAlign: 'right',
    marginTop: 2,
  },

  divider: {
    borderBottomWidth: 1.5,
    borderBottomColor: RED,
    marginBottom: 20,
    flexShrink: 0,
  },

  metaCustomerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    flexShrink: 0,
  },
  customerSection: {
    flex: 1,
    paddingRight: 20,
  },
  sectionLabel: {
    fontSize: 7.5,
    color: RED,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  customerName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: DARK,
    marginBottom: 3,
  },
  customerLine: {
    fontSize: 9,
    color: GRAY,
    marginBottom: 2,
  },
  metaSection: {
    width: 180,
    backgroundColor: LIGHT,
    borderRadius: 4,
    padding: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  metaLabel: {
    fontSize: 8,
    color: GRAY,
  },
  metaValue: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: DARK,
  },
  metaNumberValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: RED,
  },

  // Tabel — flexShrink: 0 zodat de tabel niet samengedrukt wordt
  tableWrap: {
    flexShrink: 0,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: DARK,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 3,
  },
  thText: {
    color: '#ffffff',
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e8e8e8',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableRowEven: {
    backgroundColor: LIGHT,
  },

  colDesc:  { flex: 3.5 },
  colQty:   { flex: 0.8, textAlign: 'right' },
  colUnit:  { flex: 1,   textAlign: 'center' },
  colPrice: { flex: 1.5, textAlign: 'right' },
  colVat:   { flex: 0.8, textAlign: 'center' },
  colTotal: { flex: 1.5, textAlign: 'right' },

  tdText:  { fontSize: 9, color: DARK },
  tdMuted: { fontSize: 9, color: GRAY },

  // Omschrijving werkzaamheden
  descBlock: {
    borderLeftWidth: 2,
    borderLeftColor: RED,
    paddingLeft: 10,
    marginBottom: 16,
    flexShrink: 0,
  },
  descLabel: {
    fontSize: 7.5,
    color: RED,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  descText: {
    fontSize: 9.5,
    color: DARK,
    lineHeight: 1.5,
  },

  // Spacer duwt totalen + handtekening naar onder
  spacer: {
    flexGrow: 1,
  },

  // Totalen en handtekening altijd onderaan
  bottomSection: {
    flexShrink: 0,
  },

  totalsWrap: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  totalsBox: {
    width: 240,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalsLabel: {
    fontSize: 9,
    color: GRAY,
  },
  totalsValue: {
    fontSize: 9,
    color: DARK,
    textAlign: 'right',
  },
  totalsDivider: {
    borderBottomWidth: 1,
    borderBottomColor: DARK,
    marginBottom: 5,
    marginTop: 2,
  },
  totalLabel: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: DARK,
  },
  totalValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: RED,
    textAlign: 'right',
  },

  acceptBlock: {
    backgroundColor: LIGHT,
    borderLeftWidth: 3,
    borderLeftColor: RED,
    padding: 12,
  },
  acceptText: {
    fontSize: 9,
    color: GRAY,
    lineHeight: 1.5,
    marginBottom: 12,
  },
  signatureRow: {
    flexDirection: 'row',
    gap: 24,
  },
  signatureBlock: {
    flex: 1,
  },
  signatureLine: {
    borderBottomWidth: 0.75,
    borderBottomColor: '#aaa',
    height: 24,
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 7.5,
    color: GRAY,
  },

  footerWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: FOOTER_HEIGHT,
    backgroundColor: DARK,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 44,
  },
  footerText: {
    fontSize: 7.5,
    color: '#aaaaaa',
  },
})

interface Props {
  estimateNumber: string
  createdAt: Date
  customer: { name: string; email: string; address: string; phone: string }
  description: string
  lines: EstimateLine[]
  settings: CompanySettings
  logoUrl?: string
}

export default function OfferteDocument({
  estimateNumber,
  createdAt,
  customer,
  description,
  lines,
  settings,
  logoUrl,
}: Props) {
  const { subtotal, vat_total, total } = berekenTotalen(lines)
  const geldigTot = addDays(createdAt, 30)

  const phone = settings.company_phone || '06 18020530'
  const email = settings.company_email || 'info@vtdaktechniek.nl'

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* Rode accentbalk bovenaan */}
        <View style={s.accentBar} />

        {/* Hoofdinhoud — flex: 1 zodat spacer kan werken */}
        <View style={s.body}>

          {/* Header */}
          <View style={s.header}>
            <Text style={s.offerteTitle}>OFFERTE</Text>
            <View style={s.headerRight}>
              {logoUrl && <Image style={s.logo} src={logoUrl} />}
              <Text style={s.companyName}>{settings.company_name}</Text>
              <Text style={s.companyLine}>{settings.company_address}</Text>
              <Text style={s.companyLine}>{settings.company_city}</Text>
              <Text style={s.companyLine}>T: {phone}</Text>
              <Text style={s.companyLine}>E: {email}</Text>
            </View>
          </View>

          <View style={s.divider} />

          {/* Klant + meta */}
          <View style={s.metaCustomerRow}>
            <View style={s.customerSection}>
              <Text style={s.sectionLabel}>Ter attentie van</Text>
              {customer.name    && <Text style={s.customerName}>{customer.name}</Text>}
              {customer.address && <Text style={s.customerLine}>{customer.address}</Text>}
              {customer.phone   && <Text style={s.customerLine}>T: {customer.phone}</Text>}
              {customer.email   && <Text style={s.customerLine}>E: {customer.email}</Text>}
            </View>
            <View style={s.metaSection}>
              <View style={s.metaRow}>
                <Text style={s.metaLabel}>Offertenummer</Text>
                <Text style={s.metaNumberValue}>{estimateNumber}</Text>
              </View>
              <View style={s.metaRow}>
                <Text style={s.metaLabel}>Datum</Text>
                <Text style={s.metaValue}>{formatDate(createdAt.toISOString())}</Text>
              </View>
              <View style={s.metaRow}>
                <Text style={s.metaLabel}>Geldig tot</Text>
                <Text style={s.metaValue}>{formatDate(geldigTot.toISOString())}</Text>
              </View>
            </View>
          </View>

          {/* Omschrijving werkzaamheden */}
          {description && (
            <View style={s.descBlock}>
              <Text style={s.descLabel}>Omschrijving werkzaamheden</Text>
              <Text style={s.descText}>{description}</Text>
            </View>
          )}

          {/* Regelstabel */}
          <View style={s.tableWrap}>
            <View style={s.tableHeader}>
              <Text style={[s.thText, s.colDesc]}>Omschrijving</Text>
              <Text style={[s.thText, s.colQty]}>Aantal</Text>
              <Text style={[s.thText, s.colUnit]}>Eenheid</Text>
              <Text style={[s.thText, s.colPrice]}>Stukprijs</Text>
              <Text style={[s.thText, s.colVat]}>BTW</Text>
              <Text style={[s.thText, s.colTotal]}>Totaal</Text>
            </View>
            {lines.map((line, i) => (
              <View key={i} style={[s.tableRow, i % 2 === 1 ? s.tableRowEven : {}]}>
                <Text style={[s.tdText,  s.colDesc]}>{line.description}</Text>
                <Text style={[s.tdMuted, s.colQty]}>{line.quantity}</Text>
                <Text style={[s.tdMuted, s.colUnit]}>{line.unit}</Text>
                <Text style={[s.tdMuted, s.colPrice]}>{formatEuro(line.unit_price)}</Text>
                <Text style={[s.tdMuted, s.colVat]}>{line.vat_rate}%</Text>
                <Text style={[s.tdText,  s.colTotal]}>{formatEuro(regelPrijs(line))}</Text>
              </View>
            ))}
          </View>

          {/* Spacer: duwt alles hieronder naar de onderkant */}
          <View style={s.spacer} />

          {/* Onderkant: totalen + acceptatie */}
          <View style={s.bottomSection}>
            <View style={s.totalsWrap}>
              <View style={s.totalsBox}>
                <View style={s.totalsRow}>
                  <Text style={s.totalsLabel}>Subtotaal excl. BTW</Text>
                  <Text style={s.totalsValue}>{formatEuro(subtotal)}</Text>
                </View>
                <View style={s.totalsRow}>
                  <Text style={s.totalsLabel}>BTW (21%)</Text>
                  <Text style={s.totalsValue}>{formatEuro(vat_total)}</Text>
                </View>
                <View style={s.totalsDivider} />
                <View style={s.totalsRow}>
                  <Text style={s.totalLabel}>Totaal incl. BTW</Text>
                  <Text style={s.totalValue}>{formatEuro(total)}</Text>
                </View>
              </View>
            </View>

            <View style={s.acceptBlock}>
              <Text style={s.acceptText}>
                Wij vertrouwen erop u hiermee een passend aanbod te hebben gedaan. Deze offerte is
                geldig tot {formatDate(geldigTot.toISOString())}. Voor vragen kunt u contact opnemen
                via {phone} of {email}.
              </Text>
              <View style={s.signatureRow}>
                <View style={s.signatureBlock}>
                  <View style={s.signatureLine} />
                  <Text style={s.signatureLabel}>Handtekening opdrachtgever</Text>
                </View>
                <View style={s.signatureBlock}>
                  <View style={s.signatureLine} />
                  <Text style={s.signatureLabel}>Datum akkoord</Text>
                </View>
                <View style={s.signatureBlock}>
                  <View style={s.signatureLine} />
                  <Text style={s.signatureLabel}>Naam opdrachtgever</Text>
                </View>
              </View>
            </View>
          </View>

        </View>

        {/* Vaste donkere footer */}
        <View style={s.footerWrap} fixed>
          <Text style={s.footerText}>{settings.company_name}</Text>
          <Text style={s.footerText}>KvK: {settings.company_kvk}</Text>
          <Text style={s.footerText}>BTW-nr: {settings.company_btw}</Text>
        </View>

      </Page>
    </Document>
  )
}
