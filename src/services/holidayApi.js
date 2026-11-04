/** Checks Philippine public holidays through an external API before booking. */
export async function isPublicHoliday(date) {
  const year = date.slice(0, 4);
  try {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/PH`);
    if (!response.ok) throw new Error('The holiday service is temporarily unavailable. Please try again.');
    const holidays = await response.json();
    return holidays.find((holiday) => holiday.date === date) || null;
  } catch (error) {
    if (error.message === 'The holiday service is temporarily unavailable. Please try again.') throw error;
    throw new Error('Unable to reach the holiday service. Check your internet connection and try again.');
  }
}
