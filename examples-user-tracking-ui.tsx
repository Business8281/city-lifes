/**
 * Example UI Components Using User Tracking Data
 * 
 * These examples show how to display creator information
 * in your React components after the migration is applied.
 * 
 * NOTE: This is an EXAMPLES file, not meant to be compiled.
 * Copy and adapt these examples into your actual components.
 * TypeScript errors are expected and can be ignored.
 */

import { Property, AdCampaign, Message } from '@/types/database';

// ============================================
// EXAMPLE 1: Property Card with Creator Info
// ============================================

interface PropertyCardWithCreatorProps {
  property: Property;
}

export function PropertyCardWithCreator({ property }: PropertyCardWithCreatorProps) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-bold">{property.title}</h3>
      <p className="text-gray-600">₹{property.price.toLocaleString()}</p>
      
      {/* Display creator information */}
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-gray-500">
          Listed by: <span className="font-medium">{property.created_by_name || 'Unknown'}</span>
        </p>
        {property.created_by_email && (
          <p className="text-xs text-gray-400">{property.created_by_email}</p>
        )}
      </div>
    </div>
  );
}

// ============================================
// EXAMPLE 2: Admin Dashboard - Properties Table
// ============================================

export function AdminPropertiesTable({ properties }: { properties: Property[] }) {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
          <th>Created By</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {properties.map((property) => (
          <tr key={property.id}>
            <td>{property.title}</td>
            <td>₹{property.price.toLocaleString()}</td>
            <td>
              <div>
                <p className="font-medium">{property.created_by_name}</p>
                <p className="text-xs text-gray-500">{property.created_by_email}</p>
              </div>
            </td>
            <td>{new Date(property.created_at).toLocaleDateString()}</td>
            <td>
              <button onClick={() => deleteProperty(property.id)}>
                Delete (will cascade)
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ============================================
// EXAMPLE 3: Campaign Card with Creator Info
// ============================================

export function CampaignCard({ campaign }: { campaign: AdCampaign }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold">{campaign.title}</h3>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Budget</p>
          <p className="text-lg font-semibold">₹{campaign.budget}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Spent</p>
          <p className="text-lg font-semibold">₹{campaign.spent}</p>
        </div>
      </div>

      {/* Creator info */}
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-gray-500">Campaign created by:</p>
        <p className="font-medium">{campaign.created_by_name}</p>
        <p className="text-xs text-gray-400">{campaign.created_by_email}</p>
      </div>
    </div>
  );
}

// ============================================
// EXAMPLE 4: Message Thread with Sender Info
// ============================================

export function MessageThread({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
              {message.sender_name?.[0] || '?'}
            </div>
            
            {/* Message content */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{message.sender_name}</p>
                <p className="text-xs text-gray-400">{message.sender_email}</p>
              </div>
              <p className="mt-1 text-gray-700">{message.content}</p>
              <p className="mt-2 text-xs text-gray-400">
                {new Date(message.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// EXAMPLE 5: Property Details Page
// ============================================

export function PropertyDetailsPage({ property }: { property: Property }) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Property images */}
      <div className="aspect-video bg-gray-200 rounded-lg mb-6">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Property info */}
      <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
      <p className="text-2xl text-blue-600 font-bold mb-6">
        ₹{property.price.toLocaleString()}
        {property.price_type === 'monthly' && '/month'}
      </p>

      {/* Description */}
      <div className="prose max-w-none mb-8">
        <p>{property.description}</p>
      </div>

      {/* Contact card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Contact Property Owner</h3>
        
        <div className="space-y-2">
          <div>
            <p className="text-sm text-gray-500">Listed by</p>
            <p className="font-medium">{property.created_by_name || 'Property Owner'}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-blue-600">{property.created_by_email}</p>
          </div>

          {property.contact_phone && (
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{property.contact_phone}</p>
            </div>
          )}
        </div>

        <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Send Message
        </button>
      </div>

      {/* Warning about deletion */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          ⚠️ Note: Deleting this property will automatically remove all associated 
          favorites, messages, and images.
        </p>
      </div>
    </div>
  );
}

// ============================================
// EXAMPLE 6: Delete Confirmation Dialog
// ============================================

import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

export function DeletePropertyDialog({ 
  property, 
  open, 
  onOpenChange,
  onConfirm 
}: {
  property: Property;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Property?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{property.title}</strong> and all related data:
            
            <ul className="mt-4 space-y-2 text-sm">
              <li>• All favorites from users</li>
              <li>• All messages and inquiries</li>
              <li>• All property images</li>
              <li>• All ad campaigns</li>
              <li>• All notifications</li>
            </ul>

            <p className="mt-4 font-semibold text-red-600">
              This action cannot be undone!
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete Everything
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ============================================
// EXAMPLE 7: Audit Log Viewer (Admin Only)
// ============================================

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  table_name: string;
  record_id: string;
  record_data: any;
  created_at: string;
}

export function AuditLogViewer({ logs }: { logs: AuditLog[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Deletion Audit Log</h2>
      
      <div className="space-y-2">
        {logs.map((log) => (
          <div key={log.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-medium">{log.action}</span>
                {' '}on{' '}
                <span className="text-blue-600">{log.table_name}</span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(log.created_at).toLocaleString()}
              </span>
            </div>
            
            <details className="mt-2">
              <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                View deleted data
              </summary>
              <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
                {JSON.stringify(log.record_data, null, 2)}
              </pre>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// USAGE NOTES
// ============================================

/**
 * After applying the migration:
 * 
 * 1. All new properties will have created_by_name and created_by_email
 * 2. Existing properties will have these fields as NULL
 * 3. You can update existing properties if needed:
 * 
 *    UPDATE properties p
 *    SET 
 *      created_by_name = prof.full_name,
 *      created_by_email = prof.email
 *    FROM profiles prof
 *    WHERE p.user_id = prof.id
 *    AND p.created_by_name IS NULL;
 * 
 * 4. Delete operations automatically cascade to all related tables
 * 5. Storage files are automatically deleted via triggers
 */
