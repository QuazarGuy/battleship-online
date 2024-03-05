export function Events({ events: events }: { events: string[] }) {
    return (
      <ul>
      {
        events.map((event: string, index: number) =>
          <li key={ index }>{ event }</li>
        )
      }
      </ul>
    );
  }