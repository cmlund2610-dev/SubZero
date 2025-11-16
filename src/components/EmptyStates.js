import EmptyState from './EmptyState';

// Predefined empty state variations
export const EmptyStates = {
  NoClients: (props) => (
    <EmptyState
      icon="👥"
      title="No Clients Yet"
      description="Start by importing your client data or adding clients manually to see insights and analytics."
      actionText="Import Data"
      secondaryActionText="Learn More"
      {...props}
    />
  ),

  NoData: (props) => (
    <EmptyState
      icon="📊"
      title="No Data Available"
      description="Import your client data to unlock powerful analytics and insights."
      actionText="Import Now"
      {...props}
    />
  ),

  NoRenewals: (props) => (
    <EmptyState
      icon="📅"
      title="No Upcoming Renewals"
      description="Great! You don't have any contract renewals due in the near future."
      size="small"
      {...props}
    />
  ),

  NoWidgets: (props) => (
    <EmptyState
      icon="🧩"
      title="No Widgets Added"
      description="Add analytics widgets to visualize your client data and track key metrics."
      actionText="Add Widget"
      {...props}
    />
  )
};