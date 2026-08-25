import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ErrorComponent from '../app/error';
import GlobalErrorComponent from '../app/global-error';
import NotFoundComponent from '../app/not-found';

describe('Error Boundaries', () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    // 렌더 시 발생하는 console.error를 무시하도록 처리
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  describe('Error Component', () => {
    it('에러 메시지와 재시도 버튼을 렌더링하고 버튼 클릭 시 reset을 호출한다', () => {
      const resetMock = vi.fn();
      const mockError = new Error('Test segment error') as Error & { digest?: string };
      mockError.digest = '12345';

      render(<ErrorComponent error={mockError} reset={resetMock} />);

      expect(screen.getByText('일시적인 오류가 발생했습니다')).toBeInTheDocument();
      expect(screen.getByText(/페이지를 불러오는 중 문제가 생겼습니다/)).toBeInTheDocument();
      
      const retryButton = screen.getByRole('button', { name: '다시 시도' });
      expect(retryButton).toBeInTheDocument();

      fireEvent.click(retryButton);
      expect(resetMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Global Error Component', () => {
    it('하드코딩된 스타일과 재시도 버튼을 렌더링하고 버튼 클릭 시 reset을 호출한다', () => {
      const resetMock = vi.fn();
      const mockError = new Error('Test global error') as Error & { digest?: string };
      mockError.digest = '67890';

      render(<GlobalErrorComponent error={mockError} reset={resetMock} />);

      expect(screen.getByText('PosSelect')).toBeInTheDocument();
      expect(screen.getByText('서비스를 불러올 수 없습니다')).toBeInTheDocument();
      
      const retryButton = screen.getByRole('button', { name: '다시 시도' });
      expect(retryButton).toBeInTheDocument();

      fireEvent.click(retryButton);
      expect(resetMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Not Found Component', () => {
    it('404 메시지와 홈으로 돌아가기 링크를 렌더링한다', () => {
      render(<NotFoundComponent />);

      expect(screen.getByText('404')).toBeInTheDocument();
      expect(screen.getByText('페이지를 찾을 수 없습니다')).toBeInTheDocument();
      
      const homeLink = screen.getByRole('link', { name: '홈으로 돌아가기' });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
    });
  });
});
