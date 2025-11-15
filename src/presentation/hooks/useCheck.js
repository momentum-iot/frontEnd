import { useState, useCallback } from 'react';
import { checkRepository } from '../../infrastructure/api/repositories/CheckRepositoryImpl.js';
import { CheckInUseCase } from '../../application/check/CheckInUseCase.js';
import { CheckOutUseCase } from '../../application/check/CheckOutUseCase.js';
import { GetConcurrencyUseCase } from '../../application/check/GetConcurrencyUseCase.js';
import { GetUserStatusUseCase } from '../../application/check/GetUserStatusUseCase.js';

export const useCheck = () => {

  const [loading, setLoading] = useState(false);
  const [isInside, setIsInside] = useState(false);
  const [concurrency, setConcurrency] = useState(0);
  

  const checkInUseCase = new CheckInUseCase(checkRepository);
  const checkOutUseCase = new CheckOutUseCase(checkRepository);
  const concurrencyUseCase = new GetConcurrencyUseCase(checkRepository);
  const statusUseCase = new GetUserStatusUseCase(checkRepository);
  

  const checkIn = useCallback(async () => {
    setLoading(true);
    try {
      const result = await checkInUseCase.execute();
      
      
      if (result.success) {
        setIsInside(true);
      }
      
      return result;
    } catch (error) {
      console.error('[useCheck] Check-in error:', error);
      return {
        success: false,
        message: 'Error al hacer check-in'
      };
    } finally {
      setLoading(false);
    }
  }, []);
  
  
  const checkOut = useCallback(async () => {
    setLoading(true);
    try {
      const result = await checkOutUseCase.execute();
      
      
      if (result.success) {
        setIsInside(false);
      }
      
      return result;
    } catch (error) {
      console.error('[useCheck] Check-out error:', error);
      return {
        success: false,
        message: 'Error al hacer check-out'
      };
    } finally {
      setLoading(false);
    }
  }, []);
  
  
  const getConcurrency = useCallback(async () => {
    try {
      const result = await concurrencyUseCase.execute();
      
      if (result.success) {
        setConcurrency(result.count);
        return result.count;
      }
      return 0;
    } catch (error) {
      console.error('[useCheck] Concurrency error:', error);
      return 0;
    }
  }, []);
  
  
  const checkUserStatus = useCallback(async () => {
    try {
      const result = await statusUseCase.execute();
      
      if (result.success) {
        setIsInside(result.isInside);
        return result.isInside;
      }
      return false;
    } catch (error) {
      console.error('[useCheck] Status error:', error);
      return false;
    }
  }, []);
  
  
  const checkCapacity = useCallback(async (maxCapacity) => {
    try {
      return await concurrencyUseCase.checkCapacity(maxCapacity);
    } catch (error) {
      console.error('[useCheck] Capacity error:', error);
      return {
        isFull: false,
        count: 0,
        percentage: 0
      };
    }
  }, []);
  
  return {
    
    loading,
    isInside,
    concurrency,
    

    checkIn,
    checkOut,
    getConcurrency,
    checkUserStatus,
    checkCapacity
  };
};