import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import SafeScreen from '../components/SafeScreen';
import { useSeizures } from '../context/SeizureContext';
import { useKeto } from '../context/KetoContext';

const screenW = Dimensions.get('window').width;
const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(79, 131, 255, ${opacity})`,
  labelColor: () => '#555',
  propsForDots: { r: '4' },
};

const startOfDay = (d) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
const daysAgo    = (n) => startOfDay(new Date(Date.now() - n * 86400000));

export default function InsightsScreen() {
  const { items: seizures } = useSeizures();
  const { items: keto }     = useKeto();

  const weekly = useMemo(() => {
    const buckets = Array.from({ length: 7 }, (_, i) => ({ date: daysAgo(6 - i), count: 0 }));
    seizures.forEach((s) => {
      const t = startOfDay(s.time).getTime();
      const hit = buckets.find((b) => b.date.getTime() === t);
      if (hit) hit.count += 1;
    });
    return {
      labels: buckets.map((b) => b.date.toLocaleDateString(undefined, { weekday: 'short' })),
      datasets: [{ data: buckets.map((b) => b.count) }],
    };
  }, [seizures]);

  const totalThisWeek = weekly.datasets[0].data.reduce((a, b) => a + b, 0);

  const typeCounts = useMemo(() => {
    const m = {};
    seizures.forEach((s) => { m[s.type] = (m[s.type] || 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [seizures]);

  const ketoneSeries = useMemo(() => {
    const withK = keto.filter((k) => k.ketonesMmol != null).slice(0, 14).reverse();
    if (!withK.length) return null;
    return {
      labels: withK.map((k) => {
        const d = new Date(k.time);
        return `${d.getMonth() + 1}/${d.getDate()}`;
      }),
      datasets: [{ data: withK.map((k) => Number(k.ketonesMmol)) }],
    };
  }, [keto]);

  const gkiSeries = useMemo(() => {
    const withBoth = keto
      .filter((k) => k.ketonesMmol > 0 && k.glucoseMmol > 0)
      .slice(0, 14)
      .reverse();
    if (!withBoth.length) return null;
    return {
      labels: withBoth.map((k) => {
        const d = new Date(k.time);
        return `${d.getMonth() + 1}/${d.getDate()}`;
      }),
      datasets: [{ data: withBoth.map((k) => Number(k.glucoseMmol) / Number(k.ketonesMmol)) }],
    };
  }, [keto]);

  const avgKetones = useMemo(() => {
    const vals = keto.map((k) => k.ketonesMmol).filter((v) => v != null);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : '—';
  }, [keto]);

  // Correlation: daily-avg ketones vs daily seizure counts, last 14 days
  const correlation = useMemo(() => {
    const DAYS = 14;
    const days = Array.from({ length: DAYS }, (_, i) => daysAgo(DAYS - 1 - i));
    const ketoneByDay = days.map(() => ({ sum: 0, n: 0 }));
    const seizureByDay = days.map(() => 0);

    keto.forEach((k) => {
      if (k.ketonesMmol == null) return;
      const idx = days.findIndex((d) => d.getTime() === startOfDay(k.time).getTime());
      if (idx >= 0) { ketoneByDay[idx].sum += k.ketonesMmol; ketoneByDay[idx].n += 1; }
    });
    seizures.forEach((se) => {
      const idx = days.findIndex((d) => d.getTime() === startOfDay(se.time).getTime());
      if (idx >= 0) seizureByDay[idx] += 1;
    });

    if (!ketoneByDay.some((b) => b.n > 0)) return null;

    let last = 0;
    const ketoneVals = ketoneByDay.map((b) => {
      if (b.n === 0) return last;
      last = b.sum / b.n;
      return last;
    });

    const labels = days.map((d, i) => (i % 2 === 0 ? `${d.getMonth() + 1}/${d.getDate()}` : ''));

    return {
      labels,
      ketone:  { labels, datasets: [{ data: ketoneVals }] },
      seizure: { labels, datasets: [{ data: seizureByDay }] },
      totalSeizures: seizureByDay.reduce((a, b) => a + b, 0),
    };
  }, [keto, seizures]);

  return (
    <SafeScreen>
      <ScrollView contentContainerStyle={s.container}>
        <Text style={s.title}>Insights</Text>

        <View style={s.row}>
          <Stat label="Seizures (7d)" value={totalThisWeek} color="#EF4444" />
          <Stat label="Avg ketones"   value={avgKetones}    color="#10B981" />
          <Stat label="Keto entries"  value={keto.length}   color="#F59E0B" />
        </View>

        <Section title="Seizures · last 7 days">
          <BarChart
            data={weekly}
            width={screenW - 32}
            height={200}
            fromZero
            chartConfig={{ ...chartConfig, color: (o = 1) => `rgba(239, 68, 68, ${o})` }}
            style={s.chart}
          />
        </Section>

        {typeCounts.length > 0 && (
          <Section title="Seizure types">
            {typeCounts.map(([type, n]) => (
              <View key={type} style={s.typeRow}>
                <Text style={s.typeLabel}>{type}</Text>
                <Text style={s.typeCount}>{n}</Text>
              </View>
            ))}
          </Section>
        )}

        {correlation && (
          <Section title="Ketones vs seizures · last 14 days">
            <Text style={s.caption}>Daily average ketones (mmol/L)</Text>
            <LineChart
              data={correlation.ketone}
              width={screenW - 32}
              height={180}
              withDots
              chartConfig={{ ...chartConfig, color: (o = 1) => `rgba(16, 185, 129, ${o})` }}
              bezier
              style={s.chart}
            />
            <Text style={s.caption}>Seizures per day (same range)</Text>
            <BarChart
              data={correlation.seizure}
              width={screenW - 32}
              height={160}
              fromZero
              withInnerLines={false}
              chartConfig={{ ...chartConfig, decimalPlaces: 0, color: (o = 1) => `rgba(239, 68, 68, ${o})` }}
              style={s.chart}
            />
            <Text style={s.caption}>
              {correlation.totalSeizures} seizure{correlation.totalSeizures === 1 ? '' : 's'} in this window
            </Text>
          </Section>
        )}

        {ketoneSeries ? (
          <Section title="Ketone trend (mmol/L)">
            <LineChart
              data={ketoneSeries}
              width={screenW - 32}
              height={200}
              chartConfig={{ ...chartConfig, color: (o = 1) => `rgba(16, 185, 129, ${o})` }}
              bezier
              style={s.chart}
            />
          </Section>
        ) : (
          <Empty text="Log keto entries with ketone readings to see trends." />
        )}

        {gkiSeries && (
          <Section title="GKI trend (lower = deeper ketosis)">
            <LineChart
              data={gkiSeries}
              width={screenW - 32}
              height={200}
              chartConfig={chartConfig}
              bezier
              style={s.chart}
            />
          </Section>
        )}
      </ScrollView>
    </SafeScreen>
  );
}

const Stat = ({ label, value, color }) => (
  <View style={[s.stat, { borderLeftColor: color }]}>
    <Text style={s.statValue}>{value}</Text>
    <Text style={s.statLabel}>{label}</Text>
  </View>
);

const Section = ({ title, children }) => (
  <View style={s.section}>
    <Text style={s.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Empty = ({ text }) => (
  <View style={s.section}><Text style={s.empty}>{text}</Text></View>
);

const s = StyleSheet.create({
  container:    { padding: 16, paddingBottom: 40 },
  title:        { fontSize: 26, fontWeight: 'bold', marginBottom: 12 },
  row:          { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  stat:         { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 12, marginHorizontal: 4,
                  borderLeftWidth: 4, elevation: 1 },
  statValue:    { fontSize: 22, fontWeight: 'bold' },
  statLabel:    { fontSize: 12, color: '#666', marginTop: 2 },
  section:      { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 16, elevation: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  chart:        { borderRadius: 8 },
  typeRow:      { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6,
                  borderBottomWidth: 1, borderColor: '#f0f0f0' },
  typeLabel:    { color: '#333' },
  typeCount:    { fontWeight: 'bold' },
  empty:        { color: '#888', textAlign: 'center', padding: 16 },
  caption:      { fontSize: 12, color: '#666', marginTop: 6, marginBottom: 4, textAlign: 'center' },
});
