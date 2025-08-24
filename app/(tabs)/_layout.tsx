import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: '冰箱' }} />
      <Tabs.Screen name="tag" options={{ title: '標籤管理' }} />
    </Tabs>
  );
}