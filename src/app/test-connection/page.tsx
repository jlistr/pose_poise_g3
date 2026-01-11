'use client';

import React, { useState } from 'react';
import { ref, uploadString, getDownloadURL, listAll } from 'firebase/storage';
import { storage, auth } from '@/lib/firebase';
import { getProfile } from '@/dataconnect-generated';
import { signInAnonymously } from 'firebase/auth';

export default function TestConnection() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

  const testAuth = async () => {
    addLog("Testing Auth...");
    try {
        // Log the project ID being used
        addLog("Firebase Config Project ID: " + auth.app.options.projectId);
        
        if (!auth.currentUser) {
            await signInAnonymously(auth);
            addLog("Auth: Signed in anonymously as " + auth.currentUser?.uid);
        } else {
            addLog("Auth: Already signed in as " + auth.currentUser?.uid);
        }
        // Force refresh token to ensure it's valid
        const token = await auth.currentUser?.getIdToken(true);
        addLog("Auth: Token retrieved successfully (length: " + token?.length + ")");
    } catch (e: any) {
        addLog("Auth Error: " + e.message);
    }
  };

  const testStorage = async () => {
    addLog("Testing Storage...");
    try {
      if (!auth.currentUser) await testAuth();
      const testRef = ref(storage, 'test_connection.txt');
      addLog("Storage: Attempting to upload string...");
      await uploadString(testRef, "Connection Test", 'raw');
      addLog("Storage: Upload success. Getting URL...");
      const url = await getDownloadURL(testRef);
      addLog("Storage Success! URL: " + url);
    } catch (e: any) {
      addLog("Storage Error: " + e.message);
      console.error(e);
    }
  };

  const testDataConnect = async () => {
    addLog("Testing Data Connect...");
    try {
        if (!auth.currentUser) await testAuth();
        addLog("Data Connect: Fetching profile for current user...");
        // Assuming the schema has a query we can run. Using getProfile as it seems common.
        // We might need a valid UID, but let's see if the connection itself works (even if it returns null).
        const result = await getProfile({ uid: auth.currentUser?.uid || 'test' });
        addLog("Data Connect Success! Result: " + JSON.stringify(result));
    } catch (e: any) {
        addLog("Data Connect Error: " + JSON.stringify(e));
        console.error(e);
    }
  };

  return (
    <div className="p-10 font-sans">
      <h1 className="text-2xl font-bold mb-4">Connection Tester</h1>
      <div className="flex gap-4 mb-8">
        <button onClick={testAuth} className="px-4 py-2 bg-blue-500 text-white rounded">Test Auth</button>
        <button onClick={testStorage} className="px-4 py-2 bg-green-500 text-white rounded">Test Storage</button>
        <button onClick={testDataConnect} className="px-4 py-2 bg-purple-500 text-white rounded">Test Data Connect</button>
      </div>
      <div className="bg-gray-100 p-4 rounded h-96 overflow-auto border">
        {logs.map((log, i) => <div key={i} className="mb-1 font-mono text-sm">{log}</div>)}
      </div>
    </div>
  );
}
