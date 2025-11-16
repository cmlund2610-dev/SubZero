/**
 * WidgetArea - Draggable analytics widget container
 * 
 * Provides drag-and-drop interface for arranging analytics widgets.
 * Uses CSS Grid for layout with responsive breakpoints.
 */

import React, { useState, Suspense, useMemo } from 'react';
import { Box, Typography, Stack, Button, Card, CircularProgress } from '@mui/joy';
import { DragIndicator, Add } from '@mui/icons-material';

import { WidgetConfig } from '../../lib/persist.js';
import { WIDGET_REGISTRY, getAvailableWidgets } from './WidgetRegistry.js';

export default function WidgetArea({ 
  clients = [], 
  page = 'analytics',
  onAddWidget = () => {},
  showAddButton = true 
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState(null);

  // Get current widget configuration
  const config = useMemo(() => {
    return page === 'analytics' ? WidgetConfig.getAnalytics() : WidgetConfig.getDashboard();
  }, [page]);

  // Calculate available widgets based on data
  const availableWidgets = useMemo(() => {
    return getAvailableWidgets(clients);
  }, [clients]);

  // Filter enabled widgets that are actually available
  const enabledWidgets = useMemo(() => {
    return config.enabled.filter(widgetId => 
      availableWidgets.find(w => w.id === widgetId)
    );
  }, [config.enabled, availableWidgets]);

  // Handle widget reordering
  const handleReorder = (fromIndex, toIndex) => {
    const newOrder = [...config.order];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);
    
    if (page === 'analytics') {
      WidgetConfig.setAnalytics({ order: newOrder });
    } else {
      WidgetConfig.setDashboard({ order: newOrder });
    }
  };

  // Handle widget removal
  const handleRemoveWidget = (widgetId) => {
    WidgetConfig.disableWidget(page, widgetId);
  };

  // Drag and drop handlers
  const handleDragStart = (e, widgetId) => {
    setIsDragging(true);
    setDraggedWidget(widgetId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', widgetId);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedWidget(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceWidgetId = e.dataTransfer.getData('text/plain');
    const sourceIndex = enabledWidgets.indexOf(sourceWidgetId);
    
    if (sourceIndex !== -1 && sourceIndex !== targetIndex) {
      handleReorder(sourceIndex, targetIndex);
    }
  };

  // Render individual widget
  const renderWidget = (widgetId, index) => {
    const widget = WIDGET_REGISTRY[widgetId];
    if (!widget) return null;

    return (
      <Card
        key={widgetId}
        variant="outlined"
        sx={{
          gridColumn: `span ${widget.size.width}`,
          gridRow: `span ${widget.size.height}`,
          minHeight: widget.size.height * 200, // Base height per grid unit
          position: 'relative',
          cursor: isDragging && draggedWidget === widgetId ? 'grabbing' : 'grab',
          opacity: isDragging && draggedWidget === widgetId ? 0.5 : 1,
          transition: 'opacity 0.2s ease',
          '&:hover .widget-controls': {
            opacity: 1
          }
        }}
        draggable
        onDragStart={(e) => handleDragStart(e, widgetId)}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, index)}
      >
        {/* Widget Controls */}
        <Box
          className="widget-controls"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            gap: 0.5,
            opacity: 0,
            transition: 'opacity 0.2s ease',
            zIndex: 10,
            bgcolor: 'background.surface',
            borderRadius: 'sm',
            p: 0.5
          }}
        >
          <Button
            size="sm"
            variant="plain"
            sx={{ minHeight: 24, minWidth: 24 }}
          >
            <DragIndicator fontSize="small" />
          </Button>
          <Button
            size="sm"
            variant="plain"
            color="danger"
            sx={{ minHeight: 24, minWidth: 24 }}
            onClick={() => handleRemoveWidget(widgetId)}
          >
            ×
          </Button>
        </Box>

        {/* Widget Content */}
        <Box sx={{ p: 2, height: '100%' }}>
          <Typography level="title-sm" sx={{ mb: 1, fontWeight: 600 }}>
            {widget.name}
          </Typography>
          
          <Suspense 
            fallback={
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress size="sm" />
              </Box>
            }
          >
            <WidgetRenderer widgetId={widgetId} clients={clients} />
          </Suspense>
        </Box>
      </Card>
    );
  };

  // Show empty state if no widgets enabled
  if (enabledWidgets.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 400,
          textAlign: 'center',
          p: 4
        }}
      >
        <Typography level="h4" sx={{ mb: 2, color: 'text.secondary' }}>
          No Widgets Added
        </Typography>
        <Typography level="body-md" sx={{ mb: 3, color: 'text.tertiary', maxWidth: 400 }}>
          Add analytics widgets to visualize your client data. Choose from revenue trends, 
          health distributions, churn analysis, and more.
        </Typography>
        {showAddButton && (
          <Button
            startDecorator={<Add />}
            onClick={onAddWidget}
            size="lg"
          >
            Add Your First Widget
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box>
      {/* Widget Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 2,
          // For larger screens, use 12-column grid
          '@media (min-width: 1200px)': {
            gridTemplateColumns: 'repeat(12, 1fr)'
          }
        }}
      >
        {enabledWidgets.map(renderWidget)}
      </Box>

      {/* Add Widget Button */}
      {showAddButton && enabledWidgets.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            startDecorator={<Add />}
            variant="outlined"
            onClick={onAddWidget}
          >
            Add Another Widget
          </Button>
        </Box>
      )}
    </Box>
  );
}

/**
 * Dynamic widget renderer with lazy loading
 */
function WidgetRenderer({ widgetId, clients }) {
  const [WidgetComponent, setWidgetComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const widget = WIDGET_REGISTRY[widgetId];
    if (!widget) {
      setError('Widget not found');
      setLoading(false);
      return;
    }

    // Dynamically import widget component
    widget.component()
      .then(module => {
        setWidgetComponent(() => module.default);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load widget:', widgetId, err);
        setError('Failed to load widget');
        setLoading(false);
      });
  }, [widgetId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress size="sm" />
      </Box>
    );
  }

  if (error || !WidgetComponent) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Typography level="body-sm" color="danger">
          {error || 'Widget unavailable'}
        </Typography>
      </Box>
    );
  }

  return <WidgetComponent clients={clients} />;
}