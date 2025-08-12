import React, { useRef, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Clock,
  RefreshCcw,
  ArrowDown
} from 'lucide-react';

interface ProgressEvent {
  id?: number;
  event_type: 'start' | 'progress' | 'success' | 'error' | 'warning' | 'info';
  message: string;
  percentage?: number;
  timestamp: string;
  metadata?: any;
  deployment_id?: number;
}

interface DeploymentProgressEventsProps {
  events: ProgressEvent[];
  autoScroll?: boolean;
  maxHeight?: string;
  className?: string;
}

const DeploymentProgressEvents: React.FC<DeploymentProgressEventsProps> = ({
  events,
  autoScroll = true,
  maxHeight = '300px',
  className = ''
}) => {
  const eventsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && eventsEndRef.current) {
      eventsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [events, autoScroll]);

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />;
      case 'start':
        return <Clock className="w-4 h-4 text-purple-400 flex-shrink-0" />;
      case 'progress':
        return <RefreshCcw className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-gray-400 flex-shrink-0" />;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      case 'start': return 'text-purple-400';
      case 'progress': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const scrollToBottom = () => {
    eventsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`bg-gray-800 rounded-lg border border-gray-700 ${className}`}>
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <h3 className="text-sm font-medium text-white">Deployment Events</h3>
        <button
          onClick={scrollToBottom}
          className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
          title="Scroll to bottom"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>
      
      <div 
        className="p-3 overflow-y-auto font-mono text-sm"
        style={{ maxHeight }}
      >
        {events.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No events yet
          </div>
        ) : (
          <div className="space-y-2">
            {events.map((event) => (
              <div key={event.id || `${event.timestamp}-${event.message}`} className="flex items-start space-x-2">
                {getEventIcon(event.event_type)}
                <div className="flex-1 min-w-0">
                  <div className={`${getEventColor(event.event_type)}`}>
                    {event.message}
                    {event.percentage !== undefined && (
                      <span className="ml-2 text-xs bg-gray-700 px-2 py-0.5 rounded-full">
                        {event.percentage}%
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTime(event.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={eventsEndRef} />
      </div>
    </div>
  );
};

export default DeploymentProgressEvents;