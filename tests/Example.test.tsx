import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { PublicLayout } from '../src/shared';

jest.mock('react-router-dom', () => ({
    Outlet: () => <div data-testid="outlet-mock" />,
}));
    
describe('Example.tsx', ()=>{
        
    it('should validate render', ()=>{
        const { container } = render(<PublicLayout />);

        screen.debug();

        expect(container).toBeInTheDocument();
    });
    
});