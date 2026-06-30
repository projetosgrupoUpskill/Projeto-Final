import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: "#1B7A5E",
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#133022",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: "#6B7280",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#133022",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  rowAlt: {
    backgroundColor: "#F9FAFB",
  },
  label: {
    fontSize: 11,
    color: "#374151",
  },
  value: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#133022",
  },
  valuePositive: {
    color: "#059669",
  },
  valueNegative: {
    color: "#DC2626",
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#F5F3FF",
    borderRadius: 6,
    padding: 12,
    alignItems: "center",
  },
  summaryCardLabel: {
    fontSize: 9,
    color: "#6B7280",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  summaryCardValue: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#133022",
  },
  message: {
    fontSize: 10,
    color: "#4B5563",
    lineHeight: 1.6,
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#1B7A5E",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: "#727479",
  },
});

//verificação do valor - se chega como string, formata - se chega como número, mantém
function formatCurrency(value, currencySymbol = '€') {
    const numeric = typeof value === "string"
    ? parseFloat(
      value.replace(/[^0-9.,-]/g, "")//mantém ponto, vírgula e hífen para correta interpretação dos números.
      .replace(",", ".")) //formata vírgula por ponto para garantir a leitura correta dos dados do JSON
    : value;

  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: currencySymbol === '€' ? 'EUR' : 'BRL' 
  }).format(numeric ?? 0);
}

function ReportDocument({ report }) {
  const categories = Object.entries(report.categoryBreakdown ?? {});
  const generatedAt = new Date().toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.title}>Relatório Financeiro</Text>
          <Text style={styles.subtitle}>
            {report.dateRange?.start} - {report.dateRange?.end}
          </Text>
        </View>

        {/* Cards de resumo */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardLabel}>Saldo Atual</Text>
            <Text style={styles.summaryCardValue}>
              {formatCurrency(report.totalBalance)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardLabel}>Receitas</Text>
            <Text style={[styles.summaryCardValue, styles.valuePositive]}>
              {formatCurrency(report.totalIncome)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardLabel}>Despesas</Text>
            <Text style={[styles.summaryCardValue, styles.valueNegative]}>
              {formatCurrency(report.totalExpenses)}
            </Text>
          </View>
        </View>

        {/* Tendências */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tendências</Text>
          {[
            ["Média diária", report.trends?.daily],
            ["Média semanal", report.trends?.weekly],
            ["Média mensal", report.trends?.monthly],
            ["Total anual", report.trends?.yearly],
          ].map(([label, val], i) => (
            <View
              key={label}
              style={[styles.row, i % 2 === 1 && styles.rowAlt]}
            >
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{formatCurrency(val)}</Text>
            </View>
          ))}
        </View>

        {/* Categorias */}
        {categories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categorias</Text>
            {categories.map(([cat, val], i) => (
              <View
                key={cat}
                style={[styles.row, i % 2 === 1 && styles.rowAlt]}
              >
                <Text style={styles.label}>{cat}</Text>
                <Text style={styles.value}>{formatCurrency(val)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Análise da IA */}
        {report.message && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Análise</Text>
            <Text style={styles.message}>{report.message}</Text>
          </View>
        )}

        {/* Rodapé */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Gerado em: {generatedAt}</Text>
          <Text style={styles.footerText}>Relatório confidencial</Text>
        </View>
      </Page>
    </Document>
  );
}

// Função utilitária — importa e chama isto no ChatWidget
export async function downloadReportPDF(report) {
  const blob = await pdf(<ReportDocument report={report} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `relatorio-${report.dateRange?.start ?? "despesas"}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}

export default ReportDocument;
