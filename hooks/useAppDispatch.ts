import { AppDispatch } from '@/lib/store'
import { useDispatch } from 'react-redux'


// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
