'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

interface Stat {
  id: string
  label: string
  value: number
  suffix: string
  icon: string
  color: string
  order: number
}

export default function AdminStats() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      setStats(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load stats')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const handleValueChange = (id: string, newValue: string) => {
    setStats((prev) =>
      prev.map((s) => (s.id === id ? { ...s, value: parseInt(newValue) || 0 } : s))
    )
  }

  const handleLabelChange = (id: string, newLabel: string) => {
    setStats((prev) =>
      prev.map((s) => (s.id === id ? { ...s, label: newLabel } : s))
    )
  }

  const handleSuffixChange = (id: string, newSuffix: string) => {
    setStats((prev) =>
      prev.map((s) => (s.id === id ? { ...s, suffix: newSuffix } : s))
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats.map((s) => ({ id: s.id, value: s.value }))),
      })
      if (!res.ok) throw new Error()
      toast.success('Stats updated successfully')
      fetchStats()
    } catch {
      toast.error('Failed to update stats')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Stats Counters</h2>
          <p className="text-sm text-muted-foreground">Manage homepage statistic counters</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          <Save className="h-4 w-4 mr-2" />
          Save All
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stats Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Order</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Suffix</TableHead>
                  <TableHead>Preview</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.map((stat) => (
                  <TableRow key={stat.id}>
                    <TableCell className="text-center font-mono text-sm text-muted-foreground">
                      {stat.order}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground font-mono">{stat.icon}</span>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={stat.label}
                        onChange={(e) => handleLabelChange(stat.id, e.target.value)}
                        className="h-8 text-sm"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={stat.value}
                        onChange={(e) => handleValueChange(stat.id, e.target.value)}
                        className="h-8 text-sm w-32"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={stat.suffix}
                        onChange={(e) => handleSuffixChange(stat.id, e.target.value)}
                        className="h-8 text-sm w-20"
                        placeholder="+"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="text-lg font-bold text-emerald-600">
                        {stat.value.toLocaleString()}{stat.suffix}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {stats.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No stats configured.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Visual Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="text-center p-4 rounded-lg bg-muted/50"
              >
                <p className="text-2xl font-bold text-emerald-600">
                  {stat.value.toLocaleString()}{stat.suffix}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
