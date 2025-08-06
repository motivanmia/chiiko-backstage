import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

export function useAuthGuard() {
  const router = useRouter();
  onMounted(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    }
  });
}