import { all } from 'redux-saga/effects';
import { authModule, cartModule, ordersModule, productsModule } from './modules';

export default function* rootSaga() {
    console.log('Initializing root saga');
    try {
        yield all([
            authModule.saga(),
            cartModule.saga(),
            ordersModule.saga(),
            productsModule.saga()
        ]);
        console.log('Root saga initialized successfully');
    } catch (error) {
        console.error('Error initializing root saga:', error);
    }
} 