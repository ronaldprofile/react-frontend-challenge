import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/shared/ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
          <AlertTriangle className="size-12 text-destructive" />
          <h2 className="text-xl font-semibold">Algo deu errado</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            {this.state.error?.message || 'Ocorreu um erro inesperado.'}
          </p>
          <Button onClick={this.handleReset} variant="outline">
            <RefreshCw className="size-4" />
            Tentar novamente
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
