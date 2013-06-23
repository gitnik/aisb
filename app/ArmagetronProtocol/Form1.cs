using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.Win32;

namespace ArmagetronProtocol
{
    public partial class Form1 : Form
    {
        private Boolean done = false;

        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            if (this.done)
                Application.Exit();

            RegistryKey key = Registry.ClassesRoot.OpenSubKey("armagetronad");  //open myApp protocol's subkey

            if (key == null)  //if the protocol is not registered yet...we register it
            {
                key = Registry.ClassesRoot.CreateSubKey("armagetronad");
                key.SetValue(string.Empty, "URL: ArmagetronAd Protocol");
                key.SetValue("URL Protocol", string.Empty);

                key = key.CreateSubKey(@"shell\open\command");
                RegistryKey key2 = key.CreateSubKey(@"DefaultIcon");

                String path = string.Empty;
                OpenFileDialog dialog = new OpenFileDialog();
                dialog.Filter = "executables|*.exe";
                dialog.InitialDirectory = "C:";
                dialog.Title = "Select the Armagetron Executable";

                if (dialog.ShowDialog() == DialogResult.OK)
                    path = dialog.FileName;

                key.SetValue(string.Empty, path + " --connect " + "%1");
                key2.SetValue(string.Empty, path);
            }

            button1.Text = "Done!";

            this.done = true;

            key.Close();

        }
    }
}
