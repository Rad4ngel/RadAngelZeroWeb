import { ref, onValue } from 'firebase/database';
import { database } from './firebase';

const radStatusRef = ref(database, 'rad-status')


export function getRadStatus(dataHandler) {
    onValue(radStatusRef, async (snapshot) => {
        const data = await snapshot.val();
        dataHandler(data)
    });
}

