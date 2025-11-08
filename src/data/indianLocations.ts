// Tier 1 and Tier 2 cities of India
export const tier1Cities = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
];

export const tier2Cities = [
  'Jaipur',
  'Lucknow',
  'Kanpur',
  'Nagpur',
  'Indore',
  'Thane',
  'Bhopal',
  'Visakhapatnam',
  'Patna',
  'Vadodara',
  'Ghaziabad',
  'Ludhiana',
  'Agra',
  'Nashik',
  'Faridabad',
  'Meerut',
  'Rajkot',
  'Varanasi',
  'Srinagar',
  'Aurangabad',
  'Dhanbad',
  'Amritsar',
  'Allahabad',
  'Ranchi',
  'Howrah',
  'Coimbatore',
  'Jabalpur',
  'Gwalior',
  'Vijayawada',
  'Jodhpur',
  'Madurai',
  'Raipur',
  'Kota',
];

export const allCities = [...tier1Cities, ...tier2Cities].sort();

// Major areas in Tier 1 cities
export const areas = [
  // Mumbai
  'Andheri', 'Bandra', 'Borivali', 'Dadar', 'Ghatkopar', 'Juhu', 'Kurla', 'Malad', 'Powai', 'Worli',
  // Delhi
  'Connaught Place', 'Dwarka', 'Karol Bagh', 'Lajpat Nagar', 'Nehru Place', 'Rohini', 'Saket', 'Vasant Kunj',
  // Bangalore
  'Koramangala', 'Whitefield', 'Indiranagar', 'HSR Layout', 'Jayanagar', 'Malleswaram', 'Marathahalli', 'Yelahanka',
  // Hyderabad
  'Banjara Hills', 'Gachibowli', 'Hitech City', 'Jubilee Hills', 'Kondapur', 'Madhapur', 'Secunderabad',
  // Chennai
  'Adyar', 'Anna Nagar', 'T Nagar', 'Velachery', 'Besant Nagar', 'Mylapore', 'Nungambakkam',
  // Kolkata
  'Park Street', 'Salt Lake', 'Ballygunge', 'Howrah', 'New Town', 'Rajarhat',
  // Pune
  'Hinjewadi', 'Kothrud', 'Viman Nagar', 'Wakad', 'Baner', 'Aundh', 'Magarpatta',
  // Ahmedabad
  'Satellite', 'Vastrapur', 'Maninagar', 'Prahlad Nagar', 'Bodakdev',
].sort();

// Pin codes for major cities (sample data)
export const pinCodes = [
  // Mumbai
  '400001', '400002', '400050', '400051', '400052', '400053', '400058', '400059', '400069',
  // Delhi
  '110001', '110002', '110003', '110016', '110019', '110025', '110048', '110070',
  // Bangalore
  '560001', '560002', '560034', '560066', '560076', '560095', '560103',
  // Hyderabad
  '500001', '500003', '500034', '500081', '500084', '500032',
  // Chennai
  '600001', '600002', '600020', '600042', '600091', '600096',
  // Kolkata
  '700001', '700016', '700019', '700064', '700091',
  // Pune
  '411001', '411004', '411014', '411028', '411045', '411057',
  // Ahmedabad
  '380001', '380006', '380015', '380052', '380054',
].sort();
