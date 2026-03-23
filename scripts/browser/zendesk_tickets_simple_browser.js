// Simple browser version for fetching ticket details and comments - you're already authenticated!
// Paste this entire script into the Chrome console on Zendesk

// Ticket IDs to fetch
const ticketIds = [
  2627147,
  2627408,
  2627649,
  2627957,
  2628398,
  2628398,
  2628398,
  2628858,
  2628858,
  2629208,
  2629368,
  2629368,
  2629495,
  2629508,
  2629509,
  2630123,
  2630647,
  2630849,
  2631055,
  2631055,
  2631147,
  2631177,
  2631183,
  2631223,
  2631476,
  2631845,
  2631845,
  2632192,
  2632321,
  2632398,
  2632823,
  2632823,
  2632938,
  2632971,
  2632971,
  2633027,
  2633029,
  2633321,
  2633389,
  2633389,
  2633405,
  2633517,
  2633592,
  2633592,
  2633882,
  2633882,
  2633972,
  2634236,
  2634577,
  2635459,
  2635566,
  2635648,
  2636321,
  2636321,
  2636367,
  2636367,
  2636980,
  2637144,
  2637547,
  2637607,
  2637616,
  2637617,
  2637697,
  2638014,
  2638014,
  2638154,
  2638363,
  2638363,
  2638433,
  2638433,
  2638959,
  2638962,
  2638963,
  2638964,
  2639000,
  2639400,
  2639400,
  2640348,
  2640729,
  2640789,
  2641148,
  2641390,
  2641725,
  2641742,
  2641844,
  2642295,
  2642343,
  2642344,
  2642344,
  2642553,
  2642705,
  2643108,
  2643162,
  2643180,
  2643180,
  2644285,
  2644335,
  2644371,
  2644381,
  2644689,
  2644999,
  2644999,
  2645510,
  2645938,
  2645938,
  2646246,
  2646875,
  2646891,
  2646925,
  2647845,
  2647916,
  2647916,
  2648083,
  2648083,
  2648196,
  2648826,
  2648858,
  2649346,
  2650043,
  2650043,
  2650645,
  2650945,
  2651388,
  2651388,
  2651694,
  2651944,
  2651999,
  2652007,
  2652231,
  2652422,
  2652659,
  2652793,
  2653120,
  2653137,
  2653137,
  2653222,
  2653512,
  2653512,
  2653649,
  2653822,
  2653822,
  2654136,
  2654136,
  2654464,
  2654738,
  2654894,
  2655223,
  2655252,
  2655519,
  2656297,
  2656455,
  2656471,
  2657546,
  2657546,
  2657680,
  2657703,
  2658326,
  2658345,
  2658962,
  2658996,
  2658996,
  2659900,
  2659976,
  2660387,
  2660490,
  2661127,
  2661521,
  2661547,
  2661669,
  2661669,
  2661716,
  2661975,
  2662054,
  2662265,
  2662265,
  2662324,
  2662753,
  2663374,
  2663629,
  2663689,
  2663689,
  2663821,
  2663939,
  2664073,
  2664424,
  2664467,
  2664467,
  2664884,
  2665372,
  2665682,
  2665682,
  2665743,
  2665857,
  2666118,
  2666277,
  2666752,
  2667076,
  2667128,
  2667630,
  2667630,
  2667655,
  2667782,
  2667925,
  2667925,
  2668216,
  2668526,
  2668526,
  2668543,
  2669507,
  2670114,
  2670275,
  2670300,
  2670300,
  2670752,
  2670813,
  2671461,
  2671740,
  2671830,
  2671830,
  2672085,
  2672225,
  2672225,
  2672306,
  2672306,
  2672394,
  2672791,
  2673026,
  2673040,
  2673128,
  2673184,
  2673227,
  2674141,
  2674157,
  2674157,
  2674252,
  2674252,
  2674480,
  2674526,
  2674619,
  2674651,
  2675163,
  2675274,
  2675410,
  2675410,
  2675424,
  2675721,
  2675804,
  2675804,
  2675910,
  2675924,
  2676018,
  2676135,
  2676398,
  2676479,
  2676537,
  2677019,
  2677061,
  2677061,
  2677061,
  2677311,
  2677708,
  2679209,
  2679664,
  2679847,
  2681312,
  2681624,
  2681626,
  2681843,
  2681901,
  2681923,
  2682250,
  2683156,
  2683899,
  2683901,
  2683901,
  2683901,
  2684087,
  2684529,
  2684529,
  2684926,
  2685464,
  2685646,
  2685692,
  2685692,
  2685959,
  2685959,
  2686074,
  2686205,
  2687102,
  2687529,
  2687530,
  2687670,
  2687769,
  2687811,
  2687811,
  2687943,
  2688685,
  2689316,
  2689711,
  2689723,
  2689984,
  2690107,
  2690481,
  2690851,
  2690851,
  2691011,
  2691122,
  2691256,
  2691497,
  2691510,
  2691528,
  2691655,
  2691779,
  2691850,
  2691850,
  2691952,
  2692252,
  2692253,
  2692347,
  2692362,
  2692420,
  2692440,
  2692594,
  2692635,
  2692635,
  2692635,
  2692721,
  2692763,
  2692763,
  2693042,
  2693267,
  2693396,
  2693934,
  2693950,
  2694114,
  2694133,
  2694133,
  2694424,
  2694424,
  2694542,
  2694792,
  2694942,
  2694970,
  2695029,
  2695390,
  2695511,
  2695542,
  2695908,
  2696052,
  2696052,
  2696052,
  2696935,
  2697031,
  2697031,
  2697165,
  2697231,
  2697476,
  2697476,
  2697607,
  2697641,
  2697647,
  2697829,
  2698281,
  2698281,
  2698455,
  2699218,
  2699792,
  2700015,
  2700324,
  2701346,
  2701399,
  2701946,
  2701946,
  2702070,
  2702070,
  2702188,
  2702379,
  2702422,
  2702535,
  2703214,
  2703214,
  2703386,
  2703777,
  2703898,
  2703923,
  2703960,
  2704134,
  2704249,
  2704540,
  2704951,
  2705129,
  2705129,
  2705302,
  2705302,
  2705513,
  2705599,
  2705611,
  2705749,
  2706398,
  2706404,
  2706445,
  2706445,
  2706448,
  2706672,
  2706672,
  2706778,
  2706836,
  2707103,
  2707103,
  2707264,
  2707430,
  2707514,
  2707514,
  2707607,
  2707608,
  2707784,
  2707790,
  2707816,
  2708236,
  2708516,
  2708612,
  2708612,
  2708631,
  2708631,
  2708756,
  2709331,
  2709841,
  2710380,
  2710406,
  2710784,
  2710849,
  2710955,
  2711386,
  2711386,
  2711581,
  2711804,
  2711893,
  2711991,
  2711991,
  2712221,
  2712257,
  2712257,
  2712408,
  2712408,
  2712598,
  2712598,
  2712615,
  2712735,
  2713006,
  2713064,
  2713527,
  2713739,
  2713931,
  2714113,
  2714113,
  2714305,
  2714502,
  2714527,
  2715575,
  2715619,
  2715620,
  2715730,
  2716138,
  2716634,
  2716634,
  2716936,
  2716959,
  2716985,
  2717438,
  2717496,
  2717556,
  2717589,
  2717764,
  2717766,
  2717810,
  2717814,
  2717818,
  2718022,
  2718198,
  2718271,
  2718391,
  2718391,
  2718454,
  2718572,
  2718635,
  2718710,
  2718840,
  2718868,
  2718871,
  2718929,
  2718930,
  2718971,
  2719094,
  2719109,
  2719195,
  2719282,
  2719555,
  2720791,
  2721138,
  2721614,
  2721751,
  2721846,
  2721952,
  2721960,
  2722000,
  2722049,
  2722245,
  2722587,
  2723129,
  2723256,
  2723256,
  2723528,
  2723555,
  2723979,
  2724314,
  2724328,
  2724432,
  2724432,
  2724590,
  2724926,
  2725062,
  2725340,
  2725340,
  2725510,
  2725537,
  2725579,
  2725877,
  2726043,
  2726310,
  2726310,
  2726776,
  2726776,
  2726979,
  2727005,
  2727005,
  2727060,
  2727172,
  2727172,
  2727285,
  2727342,
  2727342,
  2727477,
  2728011,
  2728075,
  2728107,
  2728253,
  2728472,
  2728472,
  2728776,
  2728783,
  2729780,
  2729793,
  2729946,
  2730030,
  2730397,
  2730893,
  2730993,
  2730993,
  2731194,
  2731278,
  2731302,
  2731776,
  2731776,
  2731776,
  2732273,
  2732389,
  2733142,
  2733146,
  2733204,
  2733367,
  2733802,
  2734007,
  2734007,
  2734141,
  2734553,
  2734553,
  2734606,
  2734756,
  2734982,
  2735311,
  2735458,
  2735482,
  2735482,
  2735720,
  2735813,
  2735813,
  2735813,
  2736008,
  2736008,
  2736153,
  2736159,
  2736313,
  2736650,
  2736650,
  2736807,
  2736829,
  2736863,
  2737060,
  2737060,
  2737662,
  2737701,
  2737778,
  2737942,
  2738094,
  2738186,
  2738521,
  2738565,
  2738628,
  2738651,
  2738670,
  2738844,
  2739034,
  2739596,
  2739688,
  2739836,
  2740128,
  2740245,
  2740341,
  2741062,
  2741189,
  2741316,
  2741316,
  2741440,
  2741718,
  2742097,
  2742126,
  2742126,
  2742126,
  2742621,
  2742626,
  2742626,
  2742769,
  2742786,
  2743488,
  2743488,
  2743557,
  2743557,
  2743629,
  2743732,
  2743734,
  2743734,
  2743770,
  2743902,
  2743959,
  2743959,
  2743959,
  2744181,
  2744207,
  2744207,
  2744251,
  2744623,
  2744649,
  2744649,
  2744681,
  2744681,
  2745015,
  2745015,
  2745398,
  2745398,
  2745398,
  2745410,
  2745483,
  2745483,
  2746022
];

async function fetchTicketDetails(ticketId) {
  const response = await fetch(`/api/v2/tickets/${ticketId}.json`);
  return response.json();
}

async function fetchTicketComments(ticketId) {
  try {
    const response = await fetch(`/api/v2/tickets/${ticketId}/comments.json`);
    const data = await response.json();
    return data.comments || [];
  } catch (error) {
    console.error(`Error fetching comments for ticket ${ticketId}:`, error);
    return [];
  }
}

function extractProductArea(customFields) {
  if (!customFields || !Array.isArray(customFields)) {
    return null;
  }
  
  // Option 1: Search by field ID (most reliable)
  // Replace with your actual Product Area custom field ID
  // You can find this in Zendesk Admin > Objects and rules > Tickets > Fields
  const productAreaFieldId = null; // e.g., 12345678
  
  if (productAreaFieldId) {
    const field = customFields.find(f => f.id === productAreaFieldId);
    if (field && field.value !== null && field.value !== '') {
      return field.value;
    }
  }
  
  // Option 2: Search by field name (if available in API response)
  const productAreaKeywords = ['product area', 'product_area', 'product', 'area'];
  
  for (const field of customFields) {
    if (field.value && field.value !== null && field.value !== '') {
      // Check if field name contains product area keywords
      const fieldName = (field.name || '').toLowerCase();
      if (productAreaKeywords.some(keyword => fieldName.includes(keyword))) {
        return field.value;
      }
    }
  }
  
  return null;
}

function extractProductDevice(customFields) {
  if (!customFields || !Array.isArray(customFields)) {
    return null;
  }
  
  // Option 1: Search by field ID (most reliable)
  // Replace with your actual Product Device custom field ID
  // You can find this in Zendesk Admin > Objects and rules > Tickets > Fields
  const productDeviceFieldId = null; // e.g., 12345679
  
  if (productDeviceFieldId) {
    const field = customFields.find(f => f.id === productDeviceFieldId);
    if (field && field.value !== null && field.value !== '') {
      return field.value;
    }
  }
  
  // Option 2: Search by field name (if available in API response)
  const productDeviceKeywords = ['product device', 'product_device', 'device'];
  
  for (const field of customFields) {
    if (field.value && field.value !== null && field.value !== '') {
      // Check if field name contains product device keywords
      const fieldName = (field.name || '').toLowerCase();
      if (productDeviceKeywords.some(keyword => fieldName.includes(keyword))) {
        return field.value;
      }
    }
  }
  
  return null;
}

function extractProductResolution(customFields) {
  if (!customFields || !Array.isArray(customFields)) {
    return null;
  }
  
  // Option 1: Search by field ID (most reliable)
  // Replace with your actual Product Resolution custom field ID
  // You can find this in Zendesk Admin > Objects and rules > Tickets > Fields
  const productResolutionFieldId = null; // e.g., 12345680
  
  if (productResolutionFieldId) {
    const field = customFields.find(f => f.id === productResolutionFieldId);
    if (field && field.value !== null && field.value !== '') {
      return field.value;
    }
  }
  
  // Option 2: Search by field name (if available in API response)
  const productResolutionKeywords = ['product resolution', 'product_resolution', 'resolution'];
  
  for (const field of customFields) {
    if (field.value && field.value !== null && field.value !== '') {
      // Check if field name contains product resolution keywords
      const fieldName = (field.name || '').toLowerCase();
      if (productResolutionKeywords.some(keyword => fieldName.includes(keyword))) {
        return field.value;
      }
    }
  }
  
  return null;
}

async function fetchAllTickets() {
  const results = [];
  
  console.log(`Fetching details for ${ticketIds.length} tickets...`);
  
  for (let i = 0; i < ticketIds.length; i++) {
    const ticketId = ticketIds[i];
    
    try {
      console.log(`Ticket ${ticketId} (${i + 1}/${ticketIds.length})`);
      const response = await fetchTicketDetails(ticketId);
      
      const ticket = response.ticket;
      
      // Fetch comments separately
      const comments = await fetchTicketComments(ticketId);
      
      // Extract product area, product device, and product resolution from custom fields
      const productArea = extractProductArea(ticket.custom_fields);
      const productDevice = extractProductDevice(ticket.custom_fields);
      const productResolution = extractProductResolution(ticket.custom_fields);
      
      results.push({
        ticketId: ticketId,
        subject: ticket.subject,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        requester: ticket.requester ? ticket.requester.name : 'Unknown',
        formId: ticket.form_id || null,
        productArea: productArea,
        productDevice: productDevice,
        productResolution: productResolution,
        createdAt: ticket.created_at,
        updatedAt: ticket.updated_at,
        commentCount: comments.length,
        comments: comments.map(comment => ({
          id: comment.id,
          body: comment.body,
          author: comment.author_id,
          authorName: comment.author_id, // Will be ID, name might need separate fetch
          createdAt: comment.created_at,
          public: comment.public !== false
        }))
      });
      
      // Rate limiting - small delay between requests
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.error(`Error with ticket ${ticketId}:`, error.message);
    }
  }
  
  return results;
}

function convertToCSV(data) {
  const headers = ['Ticket ID', 'Subject', 'Status', 'Priority', 'Requester', 'Form ID', 'Product Area', 'Product Device', 'Product Resolution', 'Created At', 'Updated At', 'Comment Count', 'Comments'];
  const csvRows = [headers.join(',')];
  
  data.forEach(item => {
    const commentsText = item.comments.map(c => `${c.body}`).join(' | ');
    
    const row = [
      item.ticketId,
      `"${item.subject.replace(/"/g, '""')}"`,
      item.status,
      item.priority,
      `"${item.requester}"`,
      item.formId || '',
      `"${(item.productArea || '').toString().replace(/"/g, '""')}"`,
      `"${(item.productDevice || '').toString().replace(/"/g, '""')}"`,
      `"${(item.productResolution || '').toString().replace(/"/g, '""')}"`,
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
