import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  featureName: string;
}

interface State {
  hasError: boolean;
}

export class FeatureErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-bg-card px-6 text-center text-text-secondary">
          <p className="text-sm">Error en {this.props.featureName}</p>
          <button
            className="text-xs text-violet-400 underline underline-offset-4"
            onClick={() => this.setState({ hasError: false })}
            type="button"
          >
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
