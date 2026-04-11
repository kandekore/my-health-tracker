import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import SafeScreen from '../components/SafeScreen';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { listSeizures } from '../services/seizureApi';
import { listKeto } from '../services/ketoApi';

const RANGES = [
  { label: 'Last 7 days',  days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'All time',     days: null },
];

const daysAgoIso = (n) => new Date(Date.now() - n * 86_400_000).toISOString();

export default function ExportScreen({ navigation }) {
  const { user } = useAuth();
  const [rangeIdx, setRangeIdx] = useState(1);
  const [busy, setBusy]         = useState(null); // 'seizures' | 'keto' | 'pdf' | 'all'

  const rangeParams = () => {
    const r = RANGES[rangeIdx];
    return r.days ? { from: daysAgoIso(r.days) } : {};
  };

  const downloadCsv = async (path, filename) => {
    const { data } = await api.get(path, {
      params: rangeParams(),
      responseType: 'text',
      transformResponse: (r) => r,
    });
    const uri = FileSystem.cacheDirectory + filename;
    await FileSystem.writeAsStringAsync(uri, data, { encoding: FileSystem.EncodingType.UTF8 });
    return uri;
  };

  const shareFile = async (uri, mimeType, dialogTitle) => {
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert('Sharing unavailable', 'This device does not support sharing.');
      return;
    }
    await Sharing.shareAsync(uri, { mimeType, dialogTitle });
  };

  const exportSeizures = async () => {
    setBusy('seizures');
    try {
      const uri = await downloadCsv('/seizures/export.csv', 'seizures.csv');
      await shareFile(uri, 'text/csv', 'Share seizures CSV');
    } catch (e) { Alert.alert('Export failed', e.message); }
    finally { setBusy(null); }
  };

  const exportKeto = async () => {
    setBusy('keto');
    try {
      const uri = await downloadCsv('/keto/export.csv', 'keto.csv');
      await shareFile(uri, 'text/csv', 'Share keto CSV');
    } catch (e) { Alert.alert('Export failed', e.message); }
    finally { setBusy(null); }
  };

  const exportPdf = async () => {
    setBusy('pdf');
    try {
      const params = rangeParams();
      const [sRes, kRes] = await Promise.all([
        listSeizures({ ...params, limit: 200, skip: 0 }),
        listKeto({ ...params, limit: 200, skip: 0 }),
      ]);
      const html = buildReportHtml({
        user,
        rangeLabel: RANGES[rangeIdx].label,
        seizures: sRes.data.items,
        keto: kRes.data.items,
      });
      const { uri } = await Print.printToFileAsync({ html });
      await shareFile(uri, 'application/pdf', 'Share PDF report');
    } catch (e) { Alert.alert('Export failed', e.message); }
    finally { setBusy(null); }
  };

  const exportAll = async () => {
    setBusy('all');
    try {
      const seizUri = await downloadCsv('/seizures/export.csv', 'seizures.csv');
      await shareFile(seizUri, 'text/csv', 'Share seizures CSV');
      const ketoUri = await downloadCsv('/keto/export.csv', 'keto.csv');
      await shareFile(ketoUri, 'text/csv', 'Share keto CSV');
    } catch (e) { Alert.alert('Export failed', e.message); }
    finally { setBusy(null); }
  };

  return (
    <SafeScreen edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={s.container}>
        <View style={s.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={s.title}>Export & share</Text>
          <View style={{ width: 32 }} />
        </View>

        <Text style={s.intro}>
          Export your data as CSV spreadsheets or a formatted PDF report to share with your neurologist.
        </Text>

        <Text style={s.sectionLabel}>Date range</Text>
        <View style={s.rangeRow}>
          {RANGES.map((r, i) => (
            <TouchableOpacity
              key={r.label}
              style={[s.rangePill, i === rangeIdx && s.rangePillActive]}
              onPress={() => setRangeIdx(i)}
            >
              <Text style={[s.rangeText, i === rangeIdx && s.rangeTextActive]}>{r.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.sectionLabel}>Export options</Text>

        <ExportRow
          icon="document-text-outline"
          title="Seizures (CSV)"
          subtitle="Spreadsheet-ready, opens in Excel or Sheets"
          busy={busy === 'seizures'}
          onPress={exportSeizures}
        />
        <ExportRow
          icon="nutrition-outline"
          title="Keto data (CSV)"
          subtitle="Macros, ketones, glucose, GKI per entry"
          busy={busy === 'keto'}
          onPress={exportKeto}
        />
        <ExportRow
          icon="document-outline"
          title="Summary PDF report"
          subtitle="Formatted report with stats and entries"
          busy={busy === 'pdf'}
          onPress={exportPdf}
          accent="#4F83FF"
        />
        <ExportRow
          icon="share-social-outline"
          title="Export both CSVs"
          subtitle="Share seizures and keto together"
          busy={busy === 'all'}
          onPress={exportAll}
          accent="#10B981"
        />

        <Text style={s.hint}>
          Tip: on the share sheet, tap Mail to email the file directly to your clinician.
        </Text>
      </ScrollView>
    </SafeScreen>
  );
}

function ExportRow({ icon, title, subtitle, onPress, busy, accent = '#333' }) {
  return (
    <TouchableOpacity style={s.row} onPress={onPress} disabled={busy}>
      <View style={[s.iconWrap, { backgroundColor: `${accent}15` }]}>
        <Ionicons name={icon} size={22} color={accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.rowTitle}>{title}</Text>
        <Text style={s.rowSubtitle}>{subtitle}</Text>
      </View>
      {busy
        ? <ActivityIndicator color="#4F83FF" />
        : <Ionicons name="chevron-forward" size={20} color="#9AA3B2" />
      }
    </TouchableOpacity>
  );
}

function buildReportHtml({ user, rangeLabel, seizures, keto }) {
  const esc = (v) => String(v ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  const avgKetones = (() => {
    const v = keto.map((k) => k.ketonesMmol).filter((x) => x != null);
    return v.length ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(2) : '—';
  })();
  const avgDuration = (() => {
    if (!seizures.length) return '—';
    return Math.round(seizures.reduce((a, b) => a + b.durationSec, 0) / seizures.length);
  })();
  const typeCounts = seizures.reduce((m, s) => { m[s.type] = (m[s.type] || 0) + 1; return m; }, {});
  const typesList = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([t, n]) => `<li>${esc(t)}: <b>${n}</b></li>`)
    .join('');

  const seizureRows = seizures.slice(0, 200).map((s) => `
    <tr>
      <td>${esc(new Date(s.time).toLocaleString())}</td>
      <td>${esc(s.type)}</td>
      <td>${s.durationSec}s</td>
    </tr>`).join('');

  const ketoRows = keto.slice(0, 200).map((k) => `
    <tr>
      <td>${esc(new Date(k.time).toLocaleString())}</td>
      <td>${k.carbsG ?? ''}</td>
      <td>${k.fatG ?? ''}</td>
      <td>${k.proteinG ?? ''}</td>
      <td>${k.ketonesMmol ?? ''}</td>
      <td>${k.glucoseMmol ?? ''}</td>
      <td>${(k.ketonesMmol && k.glucoseMmol) ? (k.glucoseMmol / k.ketonesMmol).toFixed(2) : ''}</td>
    </tr>`).join('');

  return `<!doctype html><html><head><meta charset="utf-8"><style>
    body { font-family: -apple-system, Helvetica, Arial, sans-serif; color: #222; padding: 32px; }
    h1 { margin: 0 0 4px; color: #1F2937; }
    h2 { margin-top: 28px; color: #4F83FF; border-bottom: 2px solid #e5e7eb; padding-bottom: 4px; }
    .meta { color: #666; margin-bottom: 16px; }
    .stats { display: flex; gap: 12px; margin: 16px 0; }
    .stat  { flex: 1; padding: 12px; background: #f3f4f6; border-radius: 8px; }
    .stat b { display: block; font-size: 22px; color: #1F2937; }
    .stat span { font-size: 11px; color: #666; text-transform: uppercase; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
    th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #eee; }
    th { background: #f9fafb; }
    ul { padding-left: 18px; }
  </style></head><body>
    <h1>Health Report</h1>
    <div class="meta">
      ${esc(user?.name || user?.email || '')}${user?.email ? ` · ${esc(user.email)}` : ''}<br>
      Range: <b>${esc(rangeLabel)}</b> · Generated ${esc(new Date().toLocaleString())}
    </div>

    <div class="stats">
      <div class="stat"><b>${seizures.length}</b><span>Seizures</span></div>
      <div class="stat"><b>${avgDuration}${seizures.length ? 's' : ''}</b><span>Avg duration</span></div>
      <div class="stat"><b>${keto.length}</b><span>Keto entries</span></div>
      <div class="stat"><b>${avgKetones}</b><span>Avg ketones</span></div>
    </div>

    ${typesList ? `<h2>Seizure types</h2><ul>${typesList}</ul>` : ''}

    ${seizureRows ? `<h2>Seizures</h2>
      <table><thead><tr><th>When</th><th>Type</th><th>Duration</th></tr></thead>
      <tbody>${seizureRows}</tbody></table>` : ''}

    ${ketoRows ? `<h2>Keto entries</h2>
      <table><thead><tr><th>When</th><th>C (g)</th><th>F (g)</th><th>P (g)</th><th>Ketones</th><th>Glucose</th><th>GKI</th></tr></thead>
      <tbody>${ketoRows}</tbody></table>` : ''}
  </body></html>`;
}

const s = StyleSheet.create({
  container:    { padding: 20, paddingBottom: 60 },
  headerRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backBtn:      { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  title:        { fontSize: 22, fontWeight: 'bold' },
  intro:        { color: '#555', marginBottom: 20 },
  sectionLabel: { fontSize: 13, color: '#666', textTransform: 'uppercase', marginTop: 16, marginBottom: 10, fontWeight: '600' },
  rangeRow:     { flexDirection: 'row', flexWrap: 'wrap' },
  rangePill:    { borderWidth: 1, borderColor: '#4F83FF', paddingVertical: 8, paddingHorizontal: 14,
                  borderRadius: 20, marginRight: 8, marginBottom: 8, backgroundColor: '#fff' },
  rangePillActive: { backgroundColor: '#4F83FF' },
  rangeText:    { color: '#4F83FF', fontWeight: '500' },
  rangeTextActive: { color: '#fff' },
  row:          { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
                  padding: 16, borderRadius: 12, marginBottom: 10, elevation: 1 },
  iconWrap:     { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowTitle:     { fontSize: 16, fontWeight: '600' },
  rowSubtitle:  { color: '#666', fontSize: 12, marginTop: 2 },
  hint:         { marginTop: 16, fontSize: 12, color: '#888', textAlign: 'center', fontStyle: 'italic' },
});
