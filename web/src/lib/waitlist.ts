export interface WaitlistEntry {
  email: string;
  telegram: string;
  timestamp: string;
  source: string;
}

const GOOGLE_APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL || '';

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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success) {
      return { success: true, message: 'Successfully joined the waitlist!' };
    } else {
      return { success: false, message: result.message || 'Failed to join waitlist' };
    }

  } catch (error) {
    console.error('Waitlist submission error:', error);
    return { 
      success: false, 
      message: 'Network error. Please try again or contact us directly.' 
    };
  }
}