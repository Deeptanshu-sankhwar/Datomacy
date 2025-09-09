export interface WaitlistEntry {
  email: string;
  telegram: string;
  timestamp: string;
  source: string;
}

const GOOGLE_APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbypXsBH4KO-TPeg8YTicjgKLhE43Kor7Nb_EkYNFb0fFgHQ9Au8moDSNVlGXLvzmlMVWQ/exec';

export async function submitWaitlistEntry(data: Omit<WaitlistEntry, 'timestamp'>): Promise<{ success: boolean; message: string }> {
  try {
    if (!GOOGLE_APPS_SCRIPT_URL) {
      console.error('Google Apps Script URL not configured');
      return { success: false, message: 'Waitlist service not configured' };
    }

    const entry: WaitlistEntry = {
      ...data,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(entry),
    });
    console.log('Response:', response);

    return { success: true, message: 'Successfully joined the waitlist!' };

  } catch (error) {
    console.error('Waitlist submission error:', error);
    return { 
      success: false, 
      message: 'Network error. Please try again or contact us directly.' 
    };
  }
}
