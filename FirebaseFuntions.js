// FirebaseFunctions.js
import { database } from './firebase'; // Ensure this path is correct
import { addDoc, collection, doc, serverTimestamp } from 'firebase/firestore';
import { query, getDocs, orderBy, limit } from 'firebase/firestore';


// saves time for max and total breath hold for a session
const saveSessionBreathHolds = async (userId, sessionData) => {
    try {
        // Use the modular syntax for Firestore
        const userDocRef = doc(database, 'users', userId);
        const sessionsCollectionRef = collection(userDocRef, 'sessions');
        await addDoc(sessionsCollectionRef, {
            ...sessionData,
            timestamp: serverTimestamp() // Use serverTimestamp from firestore
        });
        console.log('Session saved successfully');
    } catch (error) {
        console.error('Error saving session:', error);
    }
};

// // loads the latest sessions for a user
const loadSessionBreathHolds = async (userId, number) => {
    try {
        const userDocRef = doc(database, 'users', userId);
        const sessionsCollectionRef = collection(userDocRef, 'sessions');
        const q = query(sessionsCollectionRef, orderBy('timestamp', 'desc'), limit(number));

        const querySnapshot = await getDocs(q);
        const sessions = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Convert timestamp to JavaScript Date object
            const timestamp = data.timestamp ? data.timestamp.toDate() : null;
            sessions.push({ id: doc.id, ...data, timestamp });
        });

        return sessions;
    } catch (error) {
        console.error('Error loading sessions:', error);
        return [];
    }
};

// load metrics for a session
const loadSessionBreathHoldMetrics = async (userId, number) => {
    try {
        const userDocRef = doc(database, 'users', userId);
        const sessionsCollectionRef = collection(userDocRef, 'sessions');
        const q = query(sessionsCollectionRef, orderBy('timestamp', 'desc'), limit(number)); // desc to get latest sessions

        const querySnapshot = await getDocs(q);
        console.log(querySnapshot);
        const labels = [];
        const data = [];
        querySnapshot.forEach((doc) => {
            const session = doc.data();
            labels.push(session.percentageHold);
            data.push(session.holdDurations);
        });

        console.log(labels);
        console.log(data);
        return { labels: labels.reverse(), data: data.reverse() };
    } catch (error) {
        console.error('Error loading sessions:', error);
        return { labels: [], data: [] };
    }
};


export { saveSessionBreathHolds, loadSessionBreathHolds, loadSessionBreathHoldMetrics };