'use client';

import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui';
import { BatchTab } from './batch-tab';
import { HealthTab } from './health-tab';
import { ResizeTab } from './resize-tab';

export function TabsSection() {
  const [activeTab, setActiveTab] = useState('resize');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 mb-8 bg-muted/50 border border-border/40">
        <TabsTrigger value="resize" className="text-xs sm:text-sm">
          Resize
        </TabsTrigger>
        <TabsTrigger value="batch" className="text-xs sm:text-sm">
          Batch
        </TabsTrigger>
        <TabsTrigger value="health" className="text-xs sm:text-sm">
          Health
        </TabsTrigger>
      </TabsList>

      <TabsContent value="resize" className="space-y-6">
        <ResizeTab />
      </TabsContent>

      <TabsContent value="batch" className="space-y-6">
        <BatchTab />
      </TabsContent>

      <TabsContent value="health" className="space-y-6">
        <HealthTab />
      </TabsContent>
    </Tabs>
  );
}
