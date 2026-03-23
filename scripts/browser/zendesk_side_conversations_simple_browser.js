// Paste this entire script into the Chrome DevTools console on your Zendesk agent workspace
// (same origin as the API). You must already be signed in so /api/v2/... requests are authorized.
//
// Edit ticketIdsConfig below (same shape as ticket-ids.json). You can copy the object from that file
// or rebuild it with: node scripts/update-ticket-ids-from-sheets.js --file …

const ticketIdsConfig = {
  ticketIds: [
    2750987,
    2752349,
    2752899,
    2754310,
    2755172,
    2755944,
    2756842,
    2759622,
    2768006,
    2769139,
    2784294,
    2785026,
    2787689,
    2788397,
    2789843,
    2790998,
    2791657,
    2792680,
    2795185,
    2796734,
    2797636,
    2797707,
    2799871,
    2802328,
    2802403,
    2803342,
    2805318,
    2806539,
    2807606,
    2809359,
    2809598,
    2810775,
    2810951,
    2811039,
    2812186,
    2812749,
    2821923,
    2822304,
    2823728,
    2823953,
    2823987,
    2827898,
    2828819,
    2831464,
    2831605
  ]
};

function getTicketIds() {
  return ticketIdsConfig.ticketIds || [];
}

// List API returns side_conversations, count, next_page, previous_page — follow next_page for full list.
async function fetchAllSideConversationsForTicket(ticketId) {
  let url = `/api/v2/tickets/${ticketId}/side_conversations.json`;
  const collected = [];
  while (url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    const page = data.side_conversations || [];
    collected.push(...page);
    url = data.next_page || null;
  }
  return collected;
}

// Slack side conversations use participant slack_workspace_id and slack_channel_id (not email).
// See Zendesk Side Conversations API — participant properties / "slack" row.
function participantIsSlackSideConversation(p) {
  if (!p || typeof p !== 'object') return false;
  const wid = p.slack_workspace_id;
  const cid = p.slack_channel_id;
  const hasWorkspace = wid != null && String(wid).trim() !== '';
  const hasChannel = cid != null && String(cid).trim() !== '';
  return hasWorkspace || hasChannel;
}

function countSlackSideConversations(sideConversations) {
  return sideConversations.filter(
    (conv) => (conv.participants || []).some(participantIsSlackSideConversation)
  ).length;
}

async function fetchAllSideConversations() {
  const ticketIds = getTicketIds();
  const results = [];

  console.log(`Fetching side conversations for ${ticketIds.length} tickets...`);

  for (let i = 0; i < ticketIds.length; i++) {
    const ticketId = ticketIds[i];

    try {
      console.log(`Ticket ${ticketId} (${i + 1}/${ticketIds.length})`);
      const sideConversations = await fetchAllSideConversationsForTicket(ticketId);
      const sideConversationCount = sideConversations.length;
      const slackSideConversationCount = countSlackSideConversations(sideConversations);

      results.push({
        ticketId: ticketId,
        sideConversationCount: sideConversationCount,
        slackSideConversationCount: slackSideConversationCount
      });

      await new Promise((resolve) => setTimeout(resolve, 100)); // light rate limit
    } catch (error) {
      console.error(`Error with ticket ${ticketId}:`, error.message);
    }
  }

  return results;
}

// Ticket id, total side conversations (all types), Slack subset (participants have slack_workspace_id and/or slack_channel_id)
function convertToCSV(data) {
  const headers = ['Ticket Number', 'Side Conversation Count', 'Slack Side Conversation Count'];
  const csvRows = [headers.join(',')];

  data.forEach((item) => {
    csvRows.push(
      [item.ticketId, item.sideConversationCount, item.slackSideConversationCount].join(',')
    );
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
  const results = await fetchAllSideConversations();
  
  console.log(`\nCompleted! Fetched ${results.length} tickets.`);
  
  const totalSideConversations = results.reduce((sum, item) => sum + item.sideConversationCount, 0);
  const totalSlackSideConversations = results.reduce((sum, item) => sum + item.slackSideConversationCount, 0);
  const ticketsWithSideConversations = results.filter((item) => item.sideConversationCount > 0).length;

  console.log(`\nSummary:`);
  console.log(`- Total side conversations (all pages): ${totalSideConversations}`);
  console.log(`- Total Slack side conversations (subset): ${totalSlackSideConversations}`);
  console.log(`- Tickets with at least one side conversation: ${ticketsWithSideConversations}`);
  
  const csvData = convertToCSV(results);
  downloadCSV(csvData, 'zendesk_side_conversations.csv');
  console.log('CSV downloaded!');
  
  console.log('Full results:', results);
}

main();

