export function setup({ i2c, pin, log }) {
  const REG_INPUT_PORT_0 = 0x00;
  const REG_OUTPUT_PORT_0 = 0x02;
  const REG_CONFIG_PORT_0 = 0x06;

  const registers = new Uint8Array(0x10);
  registers[REG_CONFIG_PORT_0] = 0xff; // All inputs by default
  registers[REG_CONFIG_PORT_0 + 1] = 0xff;

  i2c.onWriteToAddress(0x20, (data) => {
    let reg = data[0];
    for (let i = 1; i < data.length; i++) {
      registers[reg] = data[i];
      log(`Wrote ${data[i].toString(16)} to reg ${reg.toString(16)}`);
      reg++;
    }
  });

  i2c.onReadFromAddress(0x20, (length) => {
    return Array.from(registers.slice(0, length));
  });
}
