const paramGetter = p => p.length === 1 ? i => p[0] : i => p[i];

class PhasedSource extends AudioWorkletProcessor {

  constructor() {
    super();
    this.state = 0;
  }

  static get parameterDescriptors() {
    return [
      { name: 'frequency', defaultValue: 440 },
      { name: 'phase', defaultValue: 0 },
    ];
  }

  process(inputs, outputs, parameters) {
    const oc = outputs[0][0];
    const phaseAt = paramGetter(parameters.phase);
    const frequencyAt = paramGetter(parameters.frequency);
    for (let i = 0; i < oc.length; i++) {
      oc[i] = Math.sin((this.state + phaseAt(i) * frequencyAt(i)));
      this.state = (this.state + (Math.PI * 2 * frequencyAt(i) / sampleRate)) % (Math.PI * 2);
    }
    return true;
  }
}

registerProcessor('PhasedSource', PhasedSource);

