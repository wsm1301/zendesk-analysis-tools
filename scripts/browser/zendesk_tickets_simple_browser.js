// Simple browser version for fetching ticket details and comments - you're already authenticated!

// Load ticket IDs from JSON file
async function loadTicketIds() {
  try {
    const response = await fetch('./ticket-ids.json');
    const data = await response.json();
    return data.ticketIds || [];
  } catch (error) {
    console.error('Error loading ticket IDs:', error);
    return [];
  }
}

// Fallback ticket IDs (if JSON file fails to load)
const fallbackTicketIds = [
  // Your ticket IDs here
  // Example: 2512915, 2512999, 2513129, etc.
];

async function getTicketIds() {
  const jsonTicketIds = await loadTicketIds();
  return jsonTicketIds.length > 0 ? jsonTicketIds : fallbackTicketIds;
}

async function fetchTicketDetails(ticketId) {
  const response = await fetch(`/api/v2/tickets/${ticketId}.json?include=comments`);
  return response.json();
}

async function fetchAllTickets() {
  const ticketIds = await getTicketIds();
  const results = [];
  
  console.log(`Fetching details for ${ticketIds.length} tickets...`);
  
  for (let i = 0; i < ticketIds.length; i++) {
    const ticketId = ticketIds[i];
    
    try {
      console.log(`Ticket ${ticketId} (${i + 1}/${ticketIds.length})`);
      const response = await fetchTicketDetails(ticketId);
      
      const ticket = response.ticket;
      const comments = response.comments || [];
      
      results.push({
        ticketId: ticketId,
        subject: ticket.subject,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        requester: ticket.requester ? ticket.requester.name : 'Unknown',
        createdAt: ticket.created_at,
        updatedAt: ticket.updated_at,
        commentCount: comments.length,
        comments: comments.map(comment => ({
          id: comment.id,
          body: comment.body,
          author: comment.author_id,
          createdAt: comment.created_at,
          public: comment.public
        }))
      });
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`Error with ticket ${ticketId}:`, error.message);
    }
  }
  
  return results;
}

function convertToCSV(data) {
  const headers = ['Ticket ID', 'Subject', 'Status', 'Priority', 'Requester', 'Created At', 'Updated At', 'Comment Count', 'Comments'];
  const csvRows = [headers.join(',')];
  
  data.forEach(item => {
    const commentsText = item.comments.map(c => `${c.body}`).join(' | ');
    
    const row = [
      item.ticketId,
      `"${item.subject.replace(/"/g, '""')}"`,
      item.status,
      item.priority,
      `"${item.requester}"`,
      item.createdAt,
      item.updatedAt,
      item.commentCount,
      `"${commentsText.replace(/"/g, '""')}"`
    ];
    
    csvRows.push(row.join(','));
  });
  
  return csvRows.join('\n');
}

function downloadCSV(csvData, filename) {
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

async function main() {
  const results = await fetchAllTickets();
  
  console.log(`\nCompleted! Fetched ${results.length} tickets.`);
  
  const totalComments = results.reduce((sum, item) => sum + item.commentCount, 0);
  const ticketsWithComments = results.filter(item => item.commentCount > 0).length;
  
  console.log(`\nSummary:`);
  console.log(`- Total comments: ${totalComments}`);
  console.log(`- Tickets with comments: ${ticketsWithComments}`);
  console.log(`- Average comments per ticket: ${(totalComments / results.length).toFixed(2)}`);
  
  const csvData = convertToCSV(results);
  downloadCSV(csvData, 'zendesk_tickets_with_comments.csv');
  console.log('CSV downloaded!');
  
  console.log('Full results:', results);
}

main();
