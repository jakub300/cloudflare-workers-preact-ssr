import { h } from 'preact';

export default function Now({ dateString }) {
  return (
    <div>
      Date from Server: <strong>{dateString}</strong>
    </div>
  );
}
